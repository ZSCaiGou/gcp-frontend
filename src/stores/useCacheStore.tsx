import { create } from "zustand/react";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_CACHE_ITEMS = 50;
const MAX_CACHE_SIZE = 1024 * 1024 * 5; // 5MB

type CacheItem<T = any> = {
    data: T;
    timestamp: number;
    ttl?: number;
};

type CacheStore = {
    cache: Record<string, CacheItem>;
    getCache: <T>(key: string) => T | null;
    setCache: <T>(key: string, data: T, options: { ttl?: number }) => void;
    removeCache: (key: string) => void;
    clearCache: () => void;
};
// 用来存储各个页面的状态
export const useCacheStore = create<CacheStore>()(
    persist(
        (set, get) => ({
            cache: {},
            getCache: (key) => {
                const item = get().cache[key];
                if (!item) return null;

                // 检查是否过期
                if (item.ttl && Date.now() > item.timestamp + item.ttl) {
                    get().removeCache(key);
                    return null;
                }

                return item.data;
            },
            setCache: (key, data, options = {}) => {
                set((state) => {
                    // 先清理过期缓存
                    const now = Date.now();
                    const validCache = Object.entries(state.cache).reduce(
                        (acc, [k, item]) => {
                            if (!item.ttl || now < item.timestamp + item.ttl) {
                                acc[k] = item;
                            }
                            return acc;
                        },
                        {} as Record<string, CacheItem>,
                    );

                    // 检查数量限制
                    const newCache = {
                        ...validCache,
                        [key]: { data, timestamp: now, ttl: options.ttl },
                    };
                    const keys = Object.keys(newCache);

                    if (keys.length > MAX_CACHE_ITEMS) {
                        // 按时间排序，移除最旧的
                        const sortedKeys = keys.sort(
                            (a, b) =>
                                newCache[a].timestamp - newCache[b].timestamp,
                        );
                        sortedKeys
                            .slice(0, keys.length - MAX_CACHE_ITEMS)
                            .forEach((k) => {
                                delete newCache[k];
                            });
                    }

                    // 检查大小限制
                    const cacheSize = JSON.stringify(newCache).length;
                    if (cacheSize > MAX_CACHE_SIZE) {
                        // 按大小估算，移除最大的项目
                        const sizeMap = keys.map((k) => ({
                            key: k,
                            size: JSON.stringify(newCache[k]).length,
                        }));
                        sizeMap.sort((a, b) => b.size - a.size);

                        let currentSize = cacheSize;
                        for (const { key, size } of sizeMap) {
                            if (currentSize <= MAX_CACHE_SIZE) break;
                            delete newCache[key];
                            currentSize -= size;
                        }
                    }

                    return { cache: newCache };
                });
            },
            removeCache: (key) => {
                set((state) => {
                    const newCache = { ...state.cache };
                    delete newCache[key];
                    return { cache: newCache };
                });
            },
            clearCache: () => set({ cache: {} }),
        }),
        {
            name: "app-cache",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cache: state.cache }),
        },
    ),
);

import roleServices from '../services/roleServices';

/**
 * Advanced in-memory cache system for profile images with IndexedDB support
 * Stores URLs with expiration times to reduce redundant API calls
 */
const imageCache = {
  cache: new Map(),
  expiryTimes: new Map(),
  idbSupported: false,
  DB_NAME: 'skill-forge-cache',
  STORE_NAME: 'profile-images',
  DB_VERSION: 1,
  dbPromise: null,
  _lastSaveOps: {},

  /**
   * Initialize the cache system
   */
  init() {
    // Check for IndexedDB support
    if ('indexedDB' in window) {
      this.idbSupported = true;
      this._initIndexedDB();

      // Clear expired cache entries every 5 minutes
      setInterval(() => this.clearExpiredCache(), 5 * 60 * 1000);

      // Load any stored cache from IndexedDB
      this._loadFromIndexedDB().catch(err => {
        console.error("Failed to load from IndexedDB:", err);
      });
    }

    // Add window event listener to save cache before page unload
    window.addEventListener('beforeunload', () => {
      this._syncCacheToIDB();
    });
  },

  /**
   * Initialize IndexedDB and return a promise
   */
  _initIndexedDB() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('expiryTime', 'expiryTime', { unique: false });
          console.log('Created IndexedDB store:', this.STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        console.log('IndexedDB initialized successfully');
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB initialization error:', event.target.error);
        this.idbSupported = false;
        reject(event.target.error);
      };
    });

    return this.dbPromise;
  },

  /**
   * Get a connection to the database
   * @returns {Promise<IDBDatabase>}
   */
  async _getDB() {
    if (!this.dbPromise) {
      return this._initIndexedDB();
    }
    return this.dbPromise;
  },

  /**
   * Load cache entries from IndexedDB
   */
  async _loadFromIndexedDB() {
    if (!this.idbSupported) return;

    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.getAll();

        transaction.oncomplete = () => {
          const entries = request.result;
          const now = Date.now();
          let loadedCount = 0;

          entries.forEach(entry => {
            // Only load non-expired entries
            if (entry.expiryTime > now) {
              this.cache.set(entry.id, entry.url);
              this.expiryTimes.set(entry.id, entry.expiryTime);
              loadedCount++;
            }
          });

          console.log(`Loaded ${loadedCount} images from IndexedDB cache`);
          resolve(loadedCount);
        };

        transaction.onerror = (event) => {
          console.error('Error loading from IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (err) {
      console.error('Failed to load from IndexedDB:', err);
      return 0;
    }
  },

  /**
   * Save an entry to IndexedDB
   * @param {string} key - Cache key
   * @param {string} url - Image URL
   * @param {number} expiryTime - Expiration timestamp
   */
  async _saveToIndexedDB(key, url, expiryTime) {
    if (!this.idbSupported) return;

    // Check if we recently saved this exact data to avoid duplicate operations
    const lastSaveKey = `last_save_${key}`;
    const lastSave = this._lastSaveOps[lastSaveKey];
    const now = Date.now();

    // If we saved this same URL in the last 2 seconds, skip
    if (lastSave &&
        lastSave.url === url &&
        lastSave.time > (now - 2000)) {
      console.log(`Skipping duplicate save for ${key}`);
      return;
    }

    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);

        // Pre-loading the image ensures it's in browser cache
        const img = new Image();
        img.src = url;

        const entry = {
          id: key,
          url: url,
          expiryTime: expiryTime,
          timestamp: now
        };

        const request = store.put(entry);

        request.onsuccess = () => {
          console.log(`Saved ${key} to IndexedDB cache`);

          // Record this save operation
          this._lastSaveOps[lastSaveKey] = {
            url,
            time: now
          };

          resolve();
        };

        request.onerror = (event) => {
          console.error('Error saving to IndexedDB:', event.target.error);
          reject(event.target.error);
        };

        transaction.oncomplete = () => resolve();
        transaction.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.error('Failed to save to IndexedDB:', err);
    }
  },

  /**
   * Sync current memory cache to IndexedDB
   */
  async _syncCacheToIDB() {
    if (!this.idbSupported) return;

    const entries = [];
    for (const [key, url] of this.cache.entries()) {
      const expiryTime = this.expiryTimes.get(key) || (Date.now() + 24*60*60*1000);
      entries.push({ id: key, url, expiryTime, timestamp: Date.now() });
    }

    if (entries.length === 0) return;

    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);

        let completed = 0;
        entries.forEach(entry => {
          const request = store.put(entry);
          request.onsuccess = () => {
            completed++;
            if (completed === entries.length) {
              console.log(`Synced ${completed} entries to IndexedDB`);
              resolve();
            }
          };
        });

        transaction.onerror = (event) => {
          console.error('Error syncing to IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (err) {
      console.error('Failed to sync to IndexedDB:', err);
    }
  },

  /**
   * Remove an entry from IndexedDB
   * @param {string} key - Cache key
   */
  async _removeFromIndexedDB(key) {
    if (!this.idbSupported) return;

    try {
      const db = await this._getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => {
          console.log(`Removed ${key} from IndexedDB cache`);
          resolve();
        };

        request.onerror = (event) => {
          console.error('Error removing from IndexedDB:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (err) {
      console.error('Failed to remove from IndexedDB:', err);
    }
  },

  /**
   * Get image from cache or network with prefetching support
   * @param {string} userId - User ID to fetch image for
   * @param {boolean} forceRefresh - Whether to bypass cache
   * @returns {Promise<string>} Image URL
   */
  async getImage(userId, forceRefresh = false) {
    if (!userId) return null;

    const cacheKey = `profile_${userId}`;
    const now = Date.now();

    // Check if we have a valid cached version in memory
    if (!forceRefresh && this.cache.has(cacheKey) && this.expiryTimes.get(cacheKey) > now) {
      console.log(`Cache hit for ${cacheKey} (memory)`);
      return this.cache.get(cacheKey);
    }

    // If not in memory but IndexedDB is supported, check there
    if (!forceRefresh && this.idbSupported && !this.cache.has(cacheKey)) {
      try {
        const db = await this._getDB();
        const result = await new Promise((resolve, reject) => {
          const transaction = db.transaction([this.STORE_NAME], 'readonly');
          const store = transaction.objectStore(this.STORE_NAME);
          const request = store.get(cacheKey);

          request.onsuccess = () => {
            if (request.result && request.result.expiryTime > now) {
              resolve(request.result);
            } else {
              resolve(null);
            }
          };

          request.onerror = (event) => {
            console.error('Error getting from IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });

        if (result) {
          console.log(`Cache hit for ${cacheKey} (IndexedDB)`);
          // Update memory cache
          this.cache.set(cacheKey, result.url);
          this.expiryTimes.set(cacheKey, result.expiryTime);
          return result.url;
        }
      } catch (err) {
        console.error('Failed to check IndexedDB:', err);
      }
    }

    // Fetch from network
    try {
      console.log(`Cache miss for ${cacheKey}, fetching from network`);
      const response = await roleServices.fetchUserProfileData(userId);
      const imageUrl = response?.data?.profilePicture;

      if (imageUrl) {
        // Cache for 30 minutes
        this.cache.set(cacheKey, imageUrl);
        const expiryTime = now + (30 * 60 * 1000);
        this.expiryTimes.set(cacheKey, expiryTime);

        // Save to IndexedDB for persistence
        this._saveToIndexedDB(cacheKey, imageUrl, expiryTime);

        return imageUrl;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile image:', error);
      // Return cached version if available (even if expired)
      return this.cache.get(cacheKey) || null;
    }
  },

  /**
   * Check if an image exists in cache without fetching
   * @param {string} userId - User ID to check
   * @returns {string|null} Image URL if cached, null otherwise
   */
  getCachedImage(userId) {
    if (!userId) return null;
    const cacheKey = `profile_${userId}`;
    return this.cache.get(cacheKey) || null;
  },

  /**
   * Clear cache for specific user
   * @param {string} userId - User ID to clear cache for
   */
  async clearCache(userId) {
    if (!userId) return;
    const cacheKey = `profile_${userId}`;
    this.cache.delete(cacheKey);
    this.expiryTimes.delete(cacheKey);

    if (this.idbSupported) {
      await this._removeFromIndexedDB(cacheKey);
    }
  },

  /**
   * Prefetch images for a list of user IDs
   * @param {Array<string>} userIds - List of user IDs to prefetch
   */
  prefetchImages(userIds) {
    if (!Array.isArray(userIds)) return;

    console.log(`Prefetching images for ${userIds.length} users`);
    // Use a small delay between requests to avoid overwhelming the server
    userIds.forEach((userId, index) => {
      setTimeout(() => {
        this.getImage(userId, false)
          .catch(err => console.log(`Prefetch failed for ${userId}:`, err));
      }, index * 100); // 100ms delay between requests
    });
  },

  /**
   * Clear all expired cache entries
   */
  async clearExpiredCache() {
    const now = Date.now();
    const expiredKeys = [];

    // Clear from memory cache
    for (const [key, expiryTime] of this.expiryTimes.entries()) {
      if (expiryTime <= now) {
        this.cache.delete(key);
        this.expiryTimes.delete(key);
        expiredKeys.push(key);
      }
    }

    console.log(`Cleared ${expiredKeys.length} expired entries from memory cache`);

    // Clear from IndexedDB
    if (this.idbSupported) {
      try {
        const db = await this._getDB();
        const transaction = db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const index = store.index('expiryTime');

        // Use IDBKeyRange to get all records with expiryTime less than now
        const range = IDBKeyRange.upperBound(now);
        const request = index.openCursor(range);
        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            store.delete(cursor.primaryKey);
            deletedCount++;
            cursor.continue();
          } else {
            console.log(`Cleared ${deletedCount} expired entries from IndexedDB`);
          }
        };

        request.onerror = (event) => {
          console.error('Error clearing expired cache from IndexedDB:', event.target.error);
        };
      } catch (err) {
        console.error('Failed to clear expired cache from IndexedDB:', err);
      }
    }
  }
};

// Initialize the cache system
imageCache.init();

export default imageCache;

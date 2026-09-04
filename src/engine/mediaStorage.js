/**
 * Better Every Day — User-Owned Custom Media Storage (IndexedDB)
 * Safely stores user-uploaded MP4s, audio, and video files locally in the browser
 * with zero cloud dependencies and maximum privacy.
 */

const DB_NAME = 'bed_custom_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'dance_party_media';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Saves a user-uploaded MP4/audio file into IndexedDB
 * @param {File} file - Uploaded File object
 * @param {string} customName - Optional friendly name
 * @returns {Promise<Object>} Metadata object including id, name, type, size, duration
 */
export async function saveCustomMedia(file, customName = '') {
  const db = await openDB();

  // Inspect duration via temporary media element
  const tempUrl = URL.createObjectURL(file);
  const mediaDuration = await getMediaDuration(tempUrl, file.type);

  const mediaItem = {
    id: 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: customName || file.name.replace(/\.[^/.]+$/, ''),
    fileName: file.name,
    type: file.type || 'video/mp4',
    size: file.size,
    duration: Math.round(mediaDuration) || 15,
    blob: file,
    createdAt: Date.now()
  };

  URL.revokeObjectURL(tempUrl);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(mediaItem);

    req.onsuccess = () => {
      resolve({
        id: mediaItem.id,
        name: mediaItem.name,
        fileName: mediaItem.fileName,
        type: mediaItem.type,
        size: mediaItem.size,
        duration: mediaItem.duration,
        createdAt: mediaItem.createdAt
      });
    };

    req.onerror = () => reject(req.error);
  });
}

/**
 * Gets list of all saved media (metadata only, excluding heavy blobs for speed)
 */
export async function getAllCustomMedia() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = (req.result || []).map(item => ({
          id: item.id,
          name: item.name,
          fileName: item.fileName,
          type: item.type,
          size: item.size,
          duration: item.duration,
          createdAt: item.createdAt
        }));
        resolve(items);
      };

      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

/**
 * Retrieves full media item with Blob URL for active playback
 */
export async function getCustomMediaById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => {
      const item = req.result;
      if (item && item.blob) {
        const blobUrl = URL.createObjectURL(item.blob);
        resolve({
          ...item,
          blobUrl
        });
      } else {
        resolve(null);
      }
    };

    req.onerror = () => reject(req.error);
  });
}

/**
 * Deletes a saved custom media item by ID
 */
export async function deleteCustomMedia(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Helper to determine duration of video or audio file
 */
function getMediaDuration(url, mimeType) {
  return new Promise((resolve) => {
    const isVideo = mimeType.startsWith('video');
    const element = document.createElement(isVideo ? 'video' : 'audio');
    element.preload = 'metadata';
    element.src = url;

    element.onloadedmetadata = () => {
      resolve(element.duration || 15);
    };

    element.onerror = () => {
      resolve(15);
    };

    // Timeout fallback if metadata fails to load in 2.5s
    setTimeout(() => resolve(15), 2500);
  });
}

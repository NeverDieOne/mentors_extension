export async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(key, function (value) {
          resolve(value[key]);
        })
      }
      catch (ex) {
        reject(ex);
      }
    });
}

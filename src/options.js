const storageKey = 'keywordList';
const regexKey = 'isRegexEnabled';

const getStorageData = key => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, value => {
      resolve(value);
    });
  });
};

const setStorageData = (key, value) => {
  return new Promise(resolve => {
    chrome.storage.local.set(
      {
        [key]: value,
      },
      () => {
        resolve();
      },
    );
  });
};

// Save Settings
document.querySelector('#save-button').addEventListener('click', async () => {
  const inputData = document.querySelector('#keyword-list').value;
  const keywords = inputData.split('\n').filter(x => x !== '');
  const isRegexEnabled = document.querySelector('#regex-switch').checked;
  await setStorageData(storageKey, keywords);
  await setStorageData(regexKey, isRegexEnabled);

  const snackbar = document.querySelector('#save-notifier').MaterialSnackbar;
  snackbar.showSnackbar({
    message: '設定を保存しました',
    timeout: 1000,
  });
});

const init = async () => {
  const keywordList = (await getStorageData(storageKey))[storageKey];
  const isRegexEnabled = (await getStorageData(regexKey))[regexKey];

  const textArea = document.querySelector('#keyword-list');
  const regexSwitch = document.querySelector('#regex-switch');

  textArea.value = keywordList.join('\n');
  if (isRegexEnabled) {
    regexSwitch.parentElement.MaterialSwitch.on();
  }
};

init();

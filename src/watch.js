const storageKey = 'keywordList';
const regexKey = 'isRegexEnabled';

const selector = {
  getChatDom: () => document.querySelector('yt-live-chat-app'),
};

const getStorageData = key => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, value => {
      resolve(value);
    });
  });
};

const getMessage = el => {
  let messageString = '';

  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      messageString += child.wholeText;
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.nodeName.toLowerCase() === 'img' && typeof child.alt === 'string') {
        messageString += child.alt;
      }
    }
  }

  return messageString;
};

const checkComment = async node => {
  if (
    node.nodeName.toLowerCase() !== 'yt-live-chat-text-message-renderer' &&
    node.nodeName.toLowerCase() !== 'yt-live-chat-paid-message-renderer'
  ) {
    return;
  }
  const keywordList = (await getStorageData(storageKey))[storageKey];
  const isRegexEnabled = (await getStorageData(regexKey))[regexKey];

  const message = getMessage(node.querySelector('#message'));

  if (
    (!isRegexEnabled && keywordList.some(pattern => message.includes(pattern))) ||
    (!!isRegexEnabled && keywordList.some(pattern => new RegExp(pattern).test(message)))
  ) {
    node.hidden = true;
  }
};

const init = async () => {
  const observer = new MutationObserver(records => {
    records.forEach(record => {
      record.addedNodes.forEach(node => checkComment(node));
    });
  });

  observer.observe(selector.getChatDom(), {
    childList: true,
    subtree: true,
  });
};
init();

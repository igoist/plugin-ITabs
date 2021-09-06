const main = () => {
  // 异步情况下，这里不要加 async
  const onMessage = (request, sender, sendResponse) => {
    const { payload } = request;

    // console.log('========', request, sender, sendResponse);

    if (request.to === 'IPin-bg') {
      switch (request.type) {
        // 传入 src 数组 & 返回 JSON.stringify 后的 base64 数组结果
        case 'getImageData':
          let imgSrcs = [];

          try {
            imgSrcs = JSON.parse(payload.taskArr);
          } catch (e) {
            imgSrcs = null;
          }

          if (!imgSrcs) return sendResponse({ error: 'Image data parse error' });

          let result = [];

          const blobToData = (blobData) => {
            return new Promise((resolve) => {
              let reader = new window.FileReader();

              reader.readAsDataURL(blobData);
              reader.onloadend = function () {
                const base64data = reader.result;

                resolve(base64data);
              };
            });
          };

          const handle = async () => {
            for (let i = 0; i < imgSrcs.length; i++) {
              let blobData = await fetch(imgSrcs[i]).then((res) => {
                return res.blob();
              });

              // let url = URL.createObjectURL(blobData);
              let r = await blobToData(blobData);
              result.push(r);
            }

            // console.log('should ', result);
            sendResponse({
              result: JSON.stringify(result),
            });
          };

          handle();

          return true;
        default:
          break;
      }
    }
  };

  chrome.runtime.onMessage.addListener(onMessage);
};

try {
  main();
} catch (err) {
  console.log(`%cmain catch%c: ${err}`, 'background: #fff; color:  #f49cec;', 'color: #149cec;', err);
}

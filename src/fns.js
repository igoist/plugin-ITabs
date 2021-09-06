import { extension } from '@Utils';

const { sendMessage } = extension;

export const handleImage = (img) => {
  let src = img.src || img.srcset.split(/[,|\s]/)[2];

  let t = '';

  let isJ = /\.jpe?g$/i;
  let isP = /\.png$/i;
  let isG = /\.gif$/i;

  if (isJ.test(src)) {
    t = 'j';
  }
  if (isP.test(src)) {
    t = 'p';
  }
  if (isG.test(src)) {
    t = 'g';
  }

  let naturalWidth = img.naturalWidth;
  let naturalHeight = img.naturalHeight;

  return {
    src,
    // alt: img.alt,
    desc: img.alt || img.title || document.title,
    el: img,
    type: t,
    naturalWidth,
    naturalHeight,
    size: {
      width: img.offsetWidth,
      height: img.offsetHeight,
    },
    height: Math.round((naturalHeight / naturalWidth) * 236),
  };
};

const o = {
  cellWidth: 236,
  cellSpace: 16,
  containerSelectorOffset: 50,
  hibernate: 5000,
  // maxCol: 0,
  // minCol: 0,
  // height: 0,
};

export const handlePos = (config) => {
  const { cell, hs } = config;

  let cols = 4 - 0;
  let col = 0;

  if (0) {
  } else {
    for (let i = 0; i < cols; i++) {
      if (hs[i] < hs[col]) {
        col = i;
      }
    }
  }

  let left = col * (o.cellWidth + o.cellSpace);
  let top = hs[col];

  // o.hs
  hs[col] += cell.height + o.cellSpace;

  let max = 0;
  let min = 0;

  for (let i = 0; i < cols; i++) {
    if (hs[i] < hs[min]) min = i;
    if (hs[i] > hs[max]) max = i;
  }

  // o.maxCol = max;
  // o.minCol = min;

  let tmpWrapHeight = hs[max] + o.containerSelectorOffset;
  // o.height = tmpWrapHeight;

  return {
    cell: {
      ...cell,
      col,
      top,
      left,
    },
    wrapHeight: tmpWrapHeight,
    hs,
  };
};

export const getData = () => {
  let t = document.images;
  let tArr = [];

  for (let i = 0; i < t.length; i++) {
    tArr.push(handleImage(t[i]));
  }

  const fSize = (item) => {
    return item.naturalWidth >= 150 && item.naturalHeight >= 150 && item.size.width >= 150 && item.size.height >= 150;
  };

  const tmpObj = {};

  const fRepeat = (item) => {
    if (tmpObj[item.src] === undefined) {
      tmpObj[item.src] = 1;
      return true;
    } else {
      tmpObj[item.src] += 1;
      return false;
    }
  };

  tArr = tArr.filter(fSize);
  tArr = tArr.filter(fRepeat);

  console.log('herer ', tmpObj);

  let arr = [];
  let tmpHs = [0, 0, 0, 0];
  let tmpWrapHeight = 0;

  for (let i = 0; i < tArr.length; i++) {
    const { cell, hs, wrapHeight } = handlePos({
      cell: tArr[i],
      hs: tmpHs,
    });

    tmpHs = hs;
    tmpWrapHeight = wrapHeight;

    cell.id = i;
    arr.push(cell);
  }

  console.log('here arr', arr);

  return {
    pins: arr,
    tmpH: tmpWrapHeight,
  };
};

const getImgInfo = (imgSrc) => {
  return new Promise((resolve) => {
    let tmpImg = new Image();

    tmpImg.src = imgSrc;

    tmpImg.addEventListener('load', () => {
      resolve({
        src: tmpImg.src,
        width: tmpImg.width,
        height: tmpImg.height,
      });
    });
  });
};

/**
 * 获取图片的 base64 编码 DataURL
 * @param image JS 图像对象
 * @return {string} 已编码的 DataURL
 */
const getImageDataURL = (imgSrc) => {
  return new Promise((resolve) => {
    let tmpImg = new Image();

    tmpImg.crossOrigin = 'Anonymous';

    tmpImg.addEventListener('load', () => {
      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = tmpImg.width;
      canvas.height = tmpImg.height;
      const ctx = canvas.getContext('2d');

      // 以图片为背景剪裁画布
      ctx.drawImage(tmpImg, 0, 0, tmpImg.width, tmpImg.height);

      // 获取图片后缀名
      const extension = tmpImg.src.substring(tmpImg.src.lastIndexOf('.') + 1).toLowerCase();

      // 某些图片 url 可能没有后缀名，默认是 png
      // return canvas.toDataURL('image/' + extension, 1);
      console.log('img: ', tmpImg);
      console.log('img: ', extension);

      let tt = document.querySelector('.et-pin-ttt');
      console.log('here tt');

      tt.innerHTML = '';
      tt.appendChild(canvas);

      try {
        resolve(canvas.toDataURL('image/' + extension, 1));
      } catch (err) {
        console.log('Errorx: ', err);
        resolve(null);
      }
    });

    tmpImg.src = imgSrc;
  });
};

fetch('https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00162-1457.jpg').then((res) => console.log(res));

const getImageDataURL2 = (imgSrc) => {
  return new Promise((resolve) => {
    fetch(imgSrc);

    let tmpImg = new Image();

    // tmpImg.crossOrigin = 'Anonymous';

    tmpImg.addEventListener('load', () => {
      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = tmpImg.width;
      canvas.height = tmpImg.height;
      const ctx = canvas.getContext('2d');

      // 以图片为背景剪裁画布
      ctx.drawImage(tmpImg, 0, 0, tmpImg.width, tmpImg.height);

      // 获取图片后缀名
      const extension = tmpImg.src.substring(tmpImg.src.lastIndexOf('.') + 1).toLowerCase();

      // 某些图片 url 可能没有后缀名，默认是 png
      // return canvas.toDataURL('image/' + extension, 1);
      console.log('img: ', tmpImg);
      console.log('img: ', extension);

      let tt = document.querySelector('.et-pin-ttt');
      console.log('here tt');

      tt.innerHTML = '';
      tt.appendChild(canvas);

      try {
        resolve(canvas.toDataURL('image/' + extension, 1));
      } catch (err) {
        console.log('Errorx: ', err);
        resolve(null);
      }
    });

    tmpImg.src = imgSrc;
  });
};

export const download = (href, filename = '') => {
  const a = document.createElement('a');
  a.download = filename;
  a.href = href;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const fnDownload = async (config) => {
  const { pins, selects } = config;

  let taskArr = pins.filter((pin) => selects.includes(pin.id));

  const handleRes = async (res) => {
    console.log('fnDownload handleRes ', res);

    if (res && res.result) {
      const arr = JSON.parse(res.result);

      for (let i = 0; i < arr.length; i++) {
        // let r = await getImageDataURL(arr[i]);

        let r = arr[i];

        if (r) {
          download(r, `test-${i}`);
        }
      }
    }
  };

  taskArr = taskArr.map((item) => item.src);

  sendMessage(
    {
      to: 'IPin-bg',
      type: 'getImageData',
      payload: {
        taskArr: JSON.stringify(taskArr),
      },
    },
    handleRes
  );
};

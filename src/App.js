import * as React from 'react';
import { useIPin } from '@Models';
import { dom, prefix } from '@Utils';

import { getData, fnDownload } from './fns';

const { scrollSmothlyTo2 } = dom;
const pf = prefix;

const { useEffect, useRef } = React;

const Pin = (props) => {
  const { id, desc, top, left, height, src, isSelected, handleClick } = props;

  const classNameEx = isSelected ? `${pf}-selected` : '';

  return (
    <div
      className={`${pf} ${pf}-cell ${classNameEx}`}
      style={{
        top: top + 'px',
        left: left + 'px',
        height: height + 'px',
        lineHeight: height + 'px',
      }}
      onClick={handleClick}
    >
      {/* {desc} */}
      <img src={src} width={236} />
    </div>
  );
};

const R = () => {
  const btnRef = useRef(null); // btn toggle
  const btnDRef = useRef(null); // btn download
  const btnSRef = useRef(null); // btn check all or revert
  const wRef = useRef(null); // wfc content wrap
  const [h, setH] = React.useState(0);
  const { pins, selects, show, dispatch } = useIPin.useContainer();

  useEffect(() => {
    const w = wRef.current;
    const btn = btnRef.current;
    const btnD = btnDRef.current;
    const btnS = btnSRef.current;

    const handleEvent = (e) => {
      if (e.altKey && e.keyCode === 75) {
        btn && btn.click();
      }

      if (e.altKey && e.keyCode === 68) {
        btnD && btnD.click();
      }

      if (e.keyCode === 74) {
        scrollSmothlyTo2(100, w);
      }

      if (!e.altKey && e.keyCode === 75) {
        scrollSmothlyTo2(-100, w);
      }

      if (e.altKey && e.keyCode === 65) {
        btnS && btnS.click();
      }
    };

    document.addEventListener('keydown', handleEvent);

    return () => {
      document.removeEventListener('keydown', handleEvent);
    };
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const { pins, tmpH } = getData();

    dispatch({
      type: 'setPins',
      payload: {
        pins,
      },
    });

    setH(tmpH);
  }, [show]);

  const handleToggle = () => {
    dispatch({
      type: 'toggleShow',
    });
  };

  const handleClick = (id) => {
    if (selects.includes(id)) {
      dispatch({
        type: 'removeSelects',
        payload: {
          item: id,
        },
      });

      console.log('remove ', id);
    } else {
      dispatch({
        type: 'addSelects',
        payload: {
          item: id,
        },
      });
      console.log('add ', id);
    }
  };

  console.log('now sel', selects);

  const handleDownload = () => {
    fnDownload({
      pins,
      selects,
    });
  };

  const handleCheckAll = () => {
    dispatch({
      type: 'allSelects',
    });
  };

  return (
    <div className={`${pf} ${pf}-wrap ${show ? '' : 'is-hidden'}`}>
      <div style={{ display: 'none' }} ref={btnRef} onClick={handleToggle}></div>
      <div style={{ display: 'none' }} ref={btnDRef} onClick={handleDownload}></div>
      <div style={{ display: 'none' }} ref={btnSRef} onClick={handleCheckAll}></div>
      <div className={`${pf} ${pf}-content clearfix`} ref={wRef}>
        <div className={`${pf} ${pf}-wf clearfix`} style={{ height: `${h}px` }}>
          {show &&
            pins.map((pin, index) => (
              <Pin key={`${pf}-cell-${index}`} {...pin} isSelected={selects.includes(pin.id)} handleClick={() => handleClick(pin.id)} />
            ))}
        </div>
      </div>

      <div className={`${pf} ${pf}-ttt`}></div>
    </div>
  );
};

export default R;

import * as React from 'react';
import { createContainer } from 'unstated-next';
import { useArray } from '@Hooks';

const { useState, useEffect } = React;

const useIPin = () => {
  const [pins, setPins] = useState([]);
  const [selects, { push: addSelects, remove: removeSelects, set: setSelects, empty: emptySelects }] = useArray([]);
  const [show, setShow] = useState(false);

  const dispatch = (action) => {
    switch (action.type) {
      case 'setPins':
        setPins(action.payload.pins);
        break;
      case 'addSelects':
        addSelects(action.payload.item);
        break;
      case 'removeSelects':
        removeSelects(action.payload.item);
        break;
      case 'allSelects':
        if (selects.length !== pins.length) {
          const tmp = pins.map((pin) => pin.id);

          setSelects(tmp);
        } else {
          emptySelects();
        }
        break;
      case 'toggleShow':
        setShow(!show);
        break;
      default:
        break;
    }
  };

  return { pins, selects, show, dispatch };
};

export default createContainer(useIPin);

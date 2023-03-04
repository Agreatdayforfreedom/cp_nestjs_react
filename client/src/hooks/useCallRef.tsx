import React, { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type ElementGroup = HTMLDivElement | HTMLLIElement | HTMLSpanElement; // and so on

function useCallRef<T extends ElementGroup>() {
  const ref = useRef<T[]>([]);
  const location = useLocation();

  const setRef = useCallback(
    (node: T) => {
      let hash = location.hash.replace('#', '');
      if (node) {
        //push every node(element) to ref.current.
        ref.current.push(node);
      }

      if (ref.current) {
        //execute the logic

        let elRef: T | undefined = ref.current.find(
          (i: T) => i.id === hash,
        ) as T;

        if (elRef) {
          const classNameArr = elRef.className.split(' ');
          if (classNameArr.includes('focused')) {
            elRef.className = classNameArr
              .filter((x) => x !== 'focused')
              .join(' ');
          }
          elRef.scrollIntoView({ behavior: 'smooth' });
          elRef.className += 'focused';
          setTimeout(() => {
            if (elRef) {
              elRef.className = classNameArr
                .filter((x) => x !== 'focused')
                .join(' ');
            }
          }, 3000);
          ref.current = [];
        }
      }
    },
    [location.hash],
  );

  return [setRef];
}

export default useCallRef;

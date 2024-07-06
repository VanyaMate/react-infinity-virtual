import React from 'react';

import {
    ComponentPropsWithoutRef,
    FC,
    memo,
    ReactNode,
    useEffect, useLayoutEffect,
    useRef,
    useState,
} from 'react';
import css from './index.module.scss';


export type BottomInfinityScrollProps =
    {
        children: Array<ReactNode>;
        distanceToNext?: number;
        onScrollHandler?: (element: HTMLDivElement) => void;
        onShowIndexChange?: (index: number) => void;
        showAmount?: number;
        contentClassName?: string;
    }
    & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const BottomInfinityScroll: FC<BottomInfinityScrollProps> = memo(function BottomInfinityScroll (props) {
    const {
              showAmount     = 40,
              distanceToNext = 400,
              onScrollHandler,
              onShowIndexChange,
              className,
              children,
              contentClassName,
              ...other
          } = props;

    const containerRef                = useRef<HTMLDivElement | null>(null);
    const [ showIndex, setShowIndex ] = useState<number>(Math.max(children.length - showAmount, 0));

    const previousScrollPosition = useRef<number>(0);
    const previousFirstItem      = useRef<ReactNode>(null);
    const previousLastItem       = useRef<ReactNode>(null);
    const previousChildrenLength = useRef<number>(children.length);
    const enableScrollCheck      = useRef<boolean>(true);

    const temporallyDisableScrollCheck = function () {
        enableScrollCheck.current = false;
        setTimeout(() => enableScrollCheck.current = true, 50);
    };

    useEffect(() => {
        if (onShowIndexChange) {
            onShowIndexChange(showIndex);
        }
    }, [ showIndex, onShowIndexChange ]);

    useLayoutEffect(() => {
        if (previousChildrenLength.current <= showAmount && children.length > showAmount) {
            setShowIndex(children.length - showAmount);
            previousChildrenLength.current = children.length;
        } else if (previousChildrenLength.current !== children.length) {
            if (previousFirstItem.current !== children[0]) {
                previousFirstItem.current = children[0];
                setShowIndex((prev) => {
                    temporallyDisableScrollCheck();
                    return Math.max(prev - previousChildrenLength.current + children.length, 0);
                });
            } else if (previousLastItem.current !== children.slice(-1)[0]) {
                temporallyDisableScrollCheck();
                previousLastItem.current = children.slice(-1)[0];
                setShowIndex((prev) => prev + previousChildrenLength.current - children.length);
            }
            previousChildrenLength.current = children.length;
        }
    }, [ children, showAmount ]);

    useLayoutEffect(() => {
        if (containerRef.current) {
            onScrollHandler?.(containerRef.current);
            const ref                      = containerRef.current;
            previousScrollPosition.current = ref.scrollTop;

            const onScroll = function () {
                const { scrollTop, scrollHeight, offsetHeight } = ref;

                const isTopScrolling  = previousScrollPosition.current > scrollTop;
                const top             = Math.abs(scrollTop);
                const needAddToTop    = (top + offsetHeight) >= (scrollHeight - distanceToNext);
                const needAddToBottom = top <= distanceToNext;

                if (isTopScrolling && needAddToTop && enableScrollCheck.current) {
                    setShowIndex((prev) => {
                        temporallyDisableScrollCheck();
                        return Math.max(prev - Math.floor(showAmount / 2), 0);
                    });
                } else if (!isTopScrolling && needAddToBottom && enableScrollCheck.current) {
                    setShowIndex((prev) => {
                        temporallyDisableScrollCheck();
                        return Math.max(Math.min(prev + Math.floor(showAmount / 2), children.length - showAmount), 0);
                    });
                }

                previousScrollPosition.current = scrollTop;
            };

            ref.addEventListener('scroll', onScroll);
            return () => ref.removeEventListener('scroll', onScroll);
        }
    }, [ children, distanceToNext, onScrollHandler, onShowIndexChange, showAmount, showIndex ]);


    return (
        <div
            { ...other }
            className={
                [
                    css.container,
                    className,
                    css.bottom,
                ]
                    .filter(Boolean)
                    .join(' ')
            }
            ref={ containerRef }
        >
            <div
                className={
                    [ css.content, contentClassName ]
                        .filter(Boolean)
                        .join(' ')
                }
            >
                {
                    new Array(showAmount)
                        .fill(0)
                        .map((_, index) => children[showIndex + index])
                }
            </div>
        </div>
    );
});
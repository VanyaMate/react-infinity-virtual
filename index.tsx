import React from 'react';
import ReactDOM from 'react-dom';

import {
    ComponentPropsWithoutRef,
    FC,
    memo,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import css from './index.module.scss';


export type InfiniteVirtualSide = 'top' | 'bottom';

export type InfiniteVirtualProps =
    {
        children: Array<ReactNode>;
        side?: InfiniteVirtualSide;
        distanceToNext?: number;
        onScrollHandler?: (element: HTMLDivElement) => void;
        onShowIndexChange?: (index: number) => void;
        showAmount?: number;
        contentClassName?: string;
    }
    & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const InfiniteVirtual: FC<InfiniteVirtualProps> = memo(function InfiniteVirtual (props) {
    const {
              showAmount     = 40,
              side           = 'top',
              distanceToNext = 500,
              onScrollHandler,
              onShowIndexChange,
              className,
              children,
              contentClassName,
              ...other
          } = props;

    const containerRef                = useRef<HTMLDivElement | null>(null);
    const [ showIndex, setShowIndex ] = useState<number>(
        side === 'top' ? 0 : children.length - showAmount,
    );
    const previousScrollPosition      = useRef<number>(0);

    useEffect(() => {
        if (containerRef.current) {
            onScrollHandler?.(containerRef.current);
            const ref                      = containerRef.current;
            previousScrollPosition.current = ref.scrollTop;

            const onScroll = function () {
                const { scrollTop, scrollHeight, offsetHeight } = ref;

                if (side === 'top') {
                    const isTopScrolling  = previousScrollPosition.current > scrollTop;
                    const needAddToTop    = scrollTop <= distanceToNext;
                    const needAddToBottom = (scrollTop + offsetHeight) >= (scrollHeight - distanceToNext);

                    if (isTopScrolling && needAddToTop) {
                        setShowIndex((prev) => {
                            onShowIndexChange?.(prev);
                            return Math.max(prev - Math.floor(showAmount / 2), 0);
                        });
                    } else if (!isTopScrolling && needAddToBottom) {
                        setShowIndex((prev) => {
                            onShowIndexChange?.(prev);
                            return Math.min(prev + Math.floor(showAmount / 2), children.length - showAmount);
                        });
                    }
                } else {
                    const isTopScrolling  = previousScrollPosition.current > scrollTop;
                    const top             = Math.abs(scrollTop);
                    const needAddToTop    = (top + offsetHeight) >= (scrollHeight - distanceToNext);
                    const needAddToBottom = top <= distanceToNext;

                    if (isTopScrolling && needAddToTop) {
                        setShowIndex((prev) => {
                            onShowIndexChange?.(prev);
                            return Math.max(prev - Math.floor(showAmount / 2), 0);
                        });
                    } else if (!isTopScrolling && needAddToBottom) {
                        setShowIndex((prev) => {
                            onShowIndexChange?.(prev);
                            return Math.min(prev + Math.floor(showAmount / 2), children.length - showAmount);
                        });
                    }
                }

                previousScrollPosition.current = scrollTop;
            };

            ref.addEventListener('scroll', onScroll);
            return () => ref.removeEventListener('scroll', onScroll);
        }
    }, []);

    return (
        <div
            { ...other }
            className={
                [
                    css.container,
                    className,
                    side === 'top' ? css.top : css.bottom,
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
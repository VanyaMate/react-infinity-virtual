import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
export type BottomInfinityScrollProps = {
    children: Array<ReactNode>;
    distanceToNext?: number;
    onScrollHandler?: (element: HTMLDivElement) => void;
    onShowIndexChange?: (index: number) => void;
    showAmount?: number;
    contentClassName?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;
export declare const BottomInfinityScroll: FC<BottomInfinityScrollProps>;

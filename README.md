# React Infinity Virtual Scroll

## Install

```
npm i @vanyamate/react-infinity-virtual
```

## Usage example

```typescript jsx
<BottomInfinityScroll
    showAmount={ 20 }
    distanceToNext={ 100 }
>
    {
        messages.map((message) => (
            <PrivateMessage
                key={ message.id }
                message={ message }
            />
        ))
    }
</BottomInfinityScroll>
```

## Props

```
showAmount          --optional --default: 40
distanceToNext      --optional --default: 500
onScrollHandler     --optional
onShowIndexChange   --optional   
contentClassName    --optional
```

- `showAmount` - number of elements that will be rendered
- `distanceToNext` - when there is less than this distance left, new elements will begin to be rendered
- `onScrollHandler` - callback when scrolling
- `onShowIndexChange` - callback after changing rendered elements
- `contentClassName` - classname for inner div
- and any default `div` props
# React Infinity Virtual Scroll

## Install

```
npm i @vanyamate/react-infinity-virtual
```

## Usage example

```typescript jsx
<InfiniteVirtual
    side="bottom"
    showAmount={ 20 }
    distanceToNext={ 100 }
>
    {
        messages[dialogueId].map((message) => (
            <PrivateMessage
                hash={ hash }
                key={ message.id }
                message={ message }
                userId={ authData.id }
            />
        ))
    }
</InfiniteVirtual>;
```

## Props

```
showAmount          --optional --default: 40
side                --optional --default: top
distanceToNext      --optional --default: 500
onScrollHandler     --optional
onShowIndexChange   --optional   
contentClassName    --optional
```

- `showAmount` - number of elements that will be rendered
- `side` - the side which is the beginning. `top` | `bottom`
- `distanceToNext` - when there is less than this distance left, new elements will begin to be rendered
- `onScrollHandler` - callback when scrolling
- `onShowIndexChange` - callback before changing rendered elements
- `contentClassName` - classname for inner div
- and any default `div` props
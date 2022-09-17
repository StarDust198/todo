import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

interface ContextMenuProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  open: boolean;
  children: ReactNode;
}

const ContextMenu = forwardRef<HTMLUListElement, ContextMenuProps>(
  (props, ref) => {
    return (
      <ul ref={ref} {...props}>
        {props.children}
      </ul>
    );
  }
);

export default ContextMenu;

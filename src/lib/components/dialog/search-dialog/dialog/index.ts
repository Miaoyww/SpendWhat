import { Dialog as DialogPrimitive } from "bits-ui";

import Overlay from "./search-dialog-overlay.svelte";
import Content from "./search-dialog.svelte";
import Close from "./search-dialog-close.svelte";

const Root = DialogPrimitive.Root;
const Portal = DialogPrimitive.Portal;

export {
	Root,
	Portal,
	Overlay,
	Content,
	Close,
	//
	Root as Dialog,
	Portal as DialogPortal,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Close as DialogClose,
};

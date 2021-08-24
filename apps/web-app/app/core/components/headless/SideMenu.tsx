import React, { forwardRef } from "react"
import { cloneElement } from "react"

import { registerComponent } from "@plasmicapp/host"
import { HTMLElementRefOf } from "@plasmicapp/react-web"
import { useButton } from "@react-aria/button"
import { useDialog } from "@react-aria/dialog"
import { FocusScope } from "@react-aria/focus"
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayContainer,
  OverlayProps,
} from "@react-aria/overlays"
import { useOverlayTriggerState } from "@react-stately/overlays"
import { AriaDialogProps } from "@react-types/dialog"
import { AnimatePresence, m } from "framer-motion"
import mergeRefs from "react-merge-refs"

import styles from "./SideMenu.module.css"

type ModalDialogProps = OverlayProps &
  AriaDialogProps & {
    children: React.ReactElement
    // className: string
    CloseButton: React.ReactElement
    positionRight: boolean
  }

function ModalDialog_(props: ModalDialogProps, refForPlasmic: HTMLElementRefOf<"div">) {
  let { children, positionRight } = props

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  let ref = React.useRef<HTMLDivElement>(null)
  let { overlayProps, underlayProps } = useOverlay(props, ref)

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll()
  let { modalProps } = useModal()

  return (
    <OverlayContainer>
      <m.div
        {...(underlayProps as any)}
        className={styles.fillFixed}
        animate={{ background: "rgba(0, 0, 0, 0.09)" }}
        exit={{ background: "rgba(0, 0, 0, 0)" }}
      >
        <FocusScope contain restoreFocus autoFocus>
          <m.div
            style={{ x: positionRight ? "100%" : "-100%" }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: positionRight ? "100%" : "-100%", opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            // ref={mergeRefs([refForPlasmic as React.RefObject<HTMLDivElement>, ref])}
            ref={ref}
            // className={[props.className, styles.slideover]}
            className={styles.slideover}
            {...(overlayProps as any)}
            {...modalProps}
          >
            {props.CloseButton}
            {children}
          </m.div>
        </FocusScope>
      </m.div>
    </OverlayContainer>
  )
}

const ModalDialog = React.forwardRef(ModalDialog_)

type SideMenuProps = {
  children: React.ReactNode
  openButton: React.ReactElement<any>
  closeButton: React.ReactElement<any>
  className: string
  show: boolean
  positionRight: boolean
}

function SideMenu_(
  {
    children = <div />,
    openButton = <button />,
    closeButton = <button />,
    show,
    className,
    positionRight,
  }: SideMenuProps,
  ref: HTMLElementRefOf<"div">
) {
  let state = useOverlayTriggerState({})
  let openButtonRef = React.useRef<HTMLButtonElement>(null)
  let closeButtonRef = React.useRef<HTMLButtonElement>(null)

  let { buttonProps: openButtonProps } = useButton(
    {
      onPress: () => state.open(),
    },
    openButtonRef
  )

  let { buttonProps: closeButtonProps } = useButton(
    {
      onPress: () => state.close(),
    },
    closeButtonRef
  )

  const OpenButton = cloneElement(openButton, { ...openButtonProps, ref: openButtonRef })
  const CloseButton = cloneElement(closeButton, { ...closeButtonProps, ref: closeButtonRef })

  return (
    <div ref={ref} className={className}>
      {OpenButton}

      <AnimatePresence>
        {(state.isOpen || show) && (
          <ModalDialog
            // className={className}
            isOpen
            onClose={state.close}
            isDismissable
            // ref={ref}
            CloseButton={CloseButton}
            positionRight={positionRight}
          >
            {children as React.ReactElement}
          </ModalDialog>
        )}
      </AnimatePresence>
    </div>
  )
}

const SideMenu = React.forwardRef(SideMenu_)
export default SideMenu

registerComponent(SideMenu, {
  name: "SideMenu",
  props: {
    show: "boolean",
    positionRight: "boolean",
    children: { type: "slot" },
    openButton: "slot",
    closeButton: "slot",
  },
  isDefaultExport: true,
  importPath: "./app/core/components/headless/SideMenu",
})

import {
  ModalContainer,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalTitle,
  PrimaryBtn,
} from './styles'

interface PlayDialog {
  handleClose: Function
}

export default function PlayDialog({ handleClose }: PlayDialog) {
  return (
    <ModalOverlay onClick={() => handleClose()}>
      <ModalContainer>
        <ModalTitle>
          <b>This application plays sounds...</b>
        </ModalTitle>
        <ModalContent>
          <ul>
            <li>Make sure your device isn't muted</li>
            <li>Click anywhere to continue</li>
          </ul>
        </ModalContent>
        <ModalFooter>
          <PrimaryBtn>Continue</PrimaryBtn>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  )
}

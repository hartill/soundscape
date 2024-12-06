import styled from '@emotion/styled'

export const ModalOverlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  cursor: default;
`

export const ModalContainer = styled.div`
  flex: 0 1 500px;
  background: #fff;
  min-width: 300px;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  border: 4px solid #333;
  border-radius: 20px;
  box-shadow: 0 0 0 3px #fff;
  margin: 0.5rem;
`

export const ModalTitle = styled.div`
  font-size: 1.2rem;
  padding: 1.5rem;
`

export const ModalContent = styled.div`
  padding: 1.5rem;
  padding-top: 0;
`

export const ModalFooter = styled.div`
  padding: 1.5rem;
  padding-top: 0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`
export const PrimaryBtn = styled.button`
  background: #1abc9c;
  padding: 0.7rem 1.2rem;
  border: 2px solid #333;
  color: #fff;

  &:hover {
    border: 2px solid #111;
  }
`

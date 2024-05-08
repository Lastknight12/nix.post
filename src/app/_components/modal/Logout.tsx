import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@nextui-org/modal";
import { signOut } from "next-auth/react";

interface props {
    isOpen: boolean | undefined,
    onOpenChange: ((isOpen: boolean) => void) | undefined
}

export default function LogoutModal ({isOpen, onOpenChange}: props) {
    return (
        <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p>Are you sure you want logout?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onClick={async () => {
                    await signOut()
                    onClose();
                  }}
                  variant="ghost"
                >
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}
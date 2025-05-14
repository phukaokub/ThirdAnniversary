"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Confetti } from "@/components/confetti"
import { Loader2, Mail } from "lucide-react"
import { motion } from "framer-motion"

interface ConfirmationModalProps {
  isOpen: boolean
  coupon: {
    id: number
    title: string
    description: string
    icon: string
    isLocked?: boolean
    usageLimit?: number
  }
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

export function ConfirmationModal({
  isOpen,
  coupon,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ConfirmationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const handleConfirm = () => {
    if (!isSubmitting) {
      setShowConfetti(true)
      setTimeout(() => {
        onConfirm()
        setShowConfetti(false)
      }, 2000)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose()}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          {/* Envelope flap */}
          <div className="absolute top-0 left-0 w-full h-16 bg-rose-100 z-0 rounded-t-lg">
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[225px] border-r-[225px] border-t-[30px] border-l-transparent border-r-transparent border-t-rose-100 transform translate-y-full"></div>
          </div>

          <DialogHeader className="relative z-10 pt-4">
            <DialogTitle className="text-center text-2xl font-bold text-gray-800">ใช้คูปอง</DialogTitle>
          </DialogHeader>

          <div className="relative flex flex-col items-center py-6 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-5xl shadow-inner mb-5"
            >
              {coupon.icon}
            </motion.div>

            <h3 className="text-2xl font-bold mb-3 text-gray-800">{coupon.title}</h3>

            <div className="border-t border-dashed border-rose-200 w-full max-w-xs pt-4 mb-4">
              <p className="text-center text-gray-600 font-medium mb-5">{coupon.description}</p>
            </div>

            <div className="bg-rose-50 rounded-lg p-4 shadow-inner max-w-xs">
              <p className="text-center text-gray-700">คุณแน่ใจหรือไม่ว่าต้องการใช้คูปองนี้? การกระทำนี้ไม่สามารถยกเลิกได้</p>
            </div>
          </div>

          <DialogFooter className="relative flex flex-col sm:flex-row sm:justify-center gap-3 z-10">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="rounded-full bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-lg gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  ใช่, ใช้เลย
                </>
              )}
            </Button>
          </DialogFooter>

          {/* Envelope seal */}
          {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-rose-500 z-20 flex items-center justify-center text-white">
            <Mail size={18} />
          </div> */}
        </DialogContent>
      </Dialog>
      {showConfetti && <Confetti />}
    </>
  )
}

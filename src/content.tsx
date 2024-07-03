import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import "tailwindcss/tailwind.css"

// Plasmo Content Script Configuration
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = (): HTMLStyleElement => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

interface PlasmoOverlayProps {} // Empty interface for component props

const PlasmoOverlay: React.FC<PlasmoOverlayProps> = () => {
  const [showIcon, setShowIcon] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [inputElement, setInputElement] = useState<HTMLElement | null>(null)
  const [generatedText, setGeneratedText] = useState("")
  const [inputText, setInputText] = useState("")
  const [sentText, setSentText] = useState("")

  useEffect(() => {
    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement
      if (target && target.matches(".msg-form__contenteditable")) {
        setInputElement(target)
        setShowIcon(true)
        setShowModal(false)
        setGeneratedText("")
      }
    }

    document.addEventListener("focusin", handleFocus)
    return () => {
      document.removeEventListener("focusin", handleFocus)
    }
  }, [])

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent losing focus
    setShowModal(true)
  }

  const handleModalClose = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      setShowModal(false)
    }
  }

  const handleGenerate = () => {
    setGeneratedText(
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
    )
    setSentText(inputText)
    setInputText("") // Clear inputText state after generating text
  }

  const handleInsert = () => {
    if (inputElement) {
      inputElement.focus()
      document.execCommand("insertText", false, generatedText)
      setShowModal(false)
      setInputText("") // Clear inputText state after insertion
    }
  }

  return (
    <>
      {showIcon && inputElement && (
        <div
          onClick={handleIconClick}
          className="ai-icon-button bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-full shadow-md absolute z-50 text-white"
          style={{
            top: `${inputElement.getBoundingClientRect().bottom + window.scrollY - 30}px`,
            left: `${inputElement.getBoundingClientRect().right + window.scrollX - 30}px`
          }}>
          AI ICON
        </div>
      )}
      {showModal && inputElement && (
        <div
          onClick={handleModalClose}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-4 rounded shadow-md absolute"
            style={{
              top: `${inputElement.getBoundingClientRect().top - 150 + window.scrollY}px`,
              left: `${inputElement.getBoundingClientRect().left + window.scrollX}px`,
              width: `${inputElement.getBoundingClientRect().width}px`
            }}>
            {generatedText && (
              <>
                {sentText && (
                  <div className="mb-4">
                    <div className="border p-2 rounded bg-blue-100 text-left">
                      {sentText}
                    </div>
                  </div>
                )}
                <div className="mt-4 mb-4">
                  <div className="border p-2 rounded bg-gray-100 text-right">
                    {generatedText}
                  </div>
                </div>
              </>
            )}

            <input
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Your prompt"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <div className="flex justify-between">
              {generatedText ? (
                <>
                  <button
                    onClick={handleInsert}
                    className="bg-green-500 text-white p-2 rounded flex items-center">
                    Insert
                    <svg
                      className="ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4 6L8 10 12 6z" />
                    </svg>
                  </button>
                  <button className="bg-gray-300 p-2 rounded flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24">
                      <path d="M12 22c-5.514 0-10-4.486-10-10h-2l3.757-5.928 3.643 5.928h-2.167c.459 3.576 3.526 6.328 7.174 6.328 4.009 0 7.263-3.216 7.263-7.207 0-3.785-2.856-6.914-6.61-7.162v-2.075c4.737.254 8.61 4.132 8.61 9.237 0 5.058-4.147 9.207-9.207 9.207zm.737-16.035v2.075c-3.526-.15-6.374 2.643-6.374 6.002 0 3.668 2.997 6.64 6.687 6.64v2.092c-5.01-.243-8.742-4.255-8.742-8.732 0-4.529 3.48-8.352 8.429-8.352z" />
                    </svg>
                    Regenerate
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGenerate}
                  className="bg-blue-500 text-white p-2 rounded w-full flex items-center justify-center">
                  Generate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlasmoOverlay

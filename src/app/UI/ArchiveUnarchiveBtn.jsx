"use client";

import { useState } from "react";

export default function ArchiveUnarchiveBook({ onConfirm, text }) {
  const [open, setOpen] = useState(false);

  const handleAccept = async () => {
    await onConfirm();
    setOpen(false);
  };

  const handleReject = () => {
    setOpen(false);
  };

  return (
    <>
      {/* trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${
          text == "ارشفة الكتاب"
            ? "bg-red-500 hover:bg-red-600"
            : "bg-primary-light hover:bg-hover-dark"
        }  text-white text-xs py-1.5 px-2 rounded-lg transition-colors duration-150 cursor-pointer`}
      >
        {text}
      </button>

      {/* popup */}
      {open && (
        <>
          {/* الخلفية السودا الشفافة */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleReject} // كليك برا يقفل
          ></div>

          {/* صندوق المودال */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 text-center">
                هل أنت متأكد من {text} ؟
              </h3>

              <p className="text-sm text-gray-500 text-center mb-6">
                لا يمكن التراجع عن عملية {text} بعد تنفيذها.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="bg-red-500 text-white text-sm py-1.5 px-4 rounded-md hover:bg-red-600 transition-colors duration-150"
                >
                  نعم
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  className="border border-gray-300 text-sm py-1.5 px-4 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

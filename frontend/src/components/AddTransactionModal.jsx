import React, { useState } from "react";

import axiosInstance from "../utils/axiosInstance";

const AddTransactionModal = ({ onClose }) => {

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {

    if (!text.trim()) {

      alert("Please enter transaction");

      return;
    }

    try {

      setLoading(true);

      await axiosInstance.post(
        "/api/v1/ai/process",
        { text }
      );

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

        onClose();

        window.location.reload();

      }, 1500);

    } catch (error) {

      console.log(error);

      alert("Failed to add transaction");
    }

    finally {

      setLoading(false);
    }
  };

  return (

    <>

      {/* Background Overlay */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backdropFilter: "blur(3px)",
        }}
      >

        {/* Modal Box */}

        <div
          style={{
            width: "420px",
            background: "#fff",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            animation: "popup 0.25s ease",
          }}
        >

          {/* Header */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >

            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Add Transaction
            </h2>

            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "#f3f4f6",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>

          </div>

          {/* Input */}

          <textarea
            rows="4"
            placeholder="Example: paid the house rent 4000"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "15px",
              outline: "none",
              resize: "none",
            }}
          />

          {/* Helper Text */}

          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginTop: "10px",
            }}
          >
            AI will automatically detect:
            income/expense, category, amount and icon.
          </p>

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >

            <button
              onClick={handleAdd}
              disabled={loading}
              style={{
                flex: 1,
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>

            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "#f3f4f6",
                color: "#111827",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

      {/* Success Popup */}

      {
        success && (

          <div
            style={{
              position: "fixed",
              top: "30px",
              right: "30px",
              background: "#10b981",
              color: "#fff",
              padding: "16px 22px",
              borderRadius: "12px",
              zIndex: 10000,
              fontWeight: "600",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            ✅ Transaction Added Successfully
          </div>

        )
      }

    </>
  );
};

export default AddTransactionModal;
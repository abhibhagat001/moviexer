import React, { useEffect } from "react";
import reactDom from "react-dom";


const Modal = ({ children,handleClose}) => {

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };


    const contentStyle = {
        backgroundColor: '#fff',
        width: '400px',
        minHeight: '120px',
        borderRadius: '12px',
        padding: '24px 28px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'box-shadow 0.2s',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
    };

    const headerStyle = {
        fontSize: '22px',
        fontWeight: 700,
        color: '#dc3545',
        margin: 0,
        paddingBottom: '0px',
        borderBottom: '1px solid #E0E0E0',
        letterSpacing: '0.5px',
        textAlign: 'left',

    };

    const bodyStyle = {
        fontSize: '16px',
        color: '#3A3A3A',
        lineHeight: 1.7,
        marginBottom: '8px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
    };

    return reactDom.createPortal(
        <div style={overlayStyle}>
            <div style={contentStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={headerStyle}><i class="bi bi-exclamation-triangle-fill"></i> {'Something Went Wrong!!'}</h3>
                </div>
                <div style={bodyStyle}> <p>{children}</p></div>
                <div><button className="btn btn-primary" onClick={handleClose}><i class="bi bi-x-circle-fill"></i> Close</button></div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default Modal;



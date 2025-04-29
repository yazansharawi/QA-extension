export const floatingButtonStyles = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10000;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const flagButtonStyles = `
  position: absolute;
  top: -20px;
  right: -20px;
  background: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: none;
  cursor: pointer;
  text-align: center;
  line-height: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  z-index: 1000;
`;

export const reportFormStyles = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 10000;
  width: 320px;
  opacity: 0;
  transition: all 0.3s ease;
`;

export const formTextareaStyles = `
  width: 100%;
  box-sizing: border-box;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: none;
  min-height: 80px;
  font-family: inherit;
  font-size: 14px;
`;

export const cancelButtonStyles = `
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
`;

export const submitButtonStyles = `
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
`; 
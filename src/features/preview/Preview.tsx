import React, { useState } from 'react';
import './Preview.css';

function Preview() {
  const [mode, setMode] = useState<'pc' | 'mobile'>('pc');

  return (
    <div className="preview-container">
      <div className="mode-selector">
        <button
          className={mode === 'pc' ? 'active' : ''}
          onClick={() => setMode('pc')}
        >
          PC端
        </button>
        <button
          className={mode === 'mobile' ? 'active' : ''}
          onClick={() => setMode('mobile')}
        >
          移动端
        </button>
      </div>
      <div className={`preview-content ${mode}`}>
        {/* 这里可以嵌入实际的页面内容 */}
        <h1>页面预览</h1>
        <p>这是{mode === 'pc' ? 'PC端' : '移动端'}的预览内容。</p>
      </div>
    </div>
  );
}

export default Preview; 
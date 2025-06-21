import React from 'react';

const IframeComponent = () => {
  return (
    <div>
      <h1>Embedded Website</h1>
      <iframe
        src="https://moderated.jitsi.net/"
        width="100%"
        height="600"
        title="Embedded Website"
        frameBorder="0"
      />
    </div>
  );
};

export default IframeComponent;

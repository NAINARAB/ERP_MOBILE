import React from 'react';
import { WebView } from 'react-native-webview';

const WebViewComp = ({ route }) => {
  const { url } = route.params;
  console.log(url);

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <iframe width="100%" height="100%" src="${url}" frameborder="0" allowfullscreen></iframe>
      </body>
      <style>
      body{
        margin: 0;
        padding: 0;
      }
      </style>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
    />
  );
};

export default WebViewComp;
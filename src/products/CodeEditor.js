import React from "react";

const CodeEditor = () => {

  return (
    <div className="">
        <iframe
          title="OneCompiler Python Editor"
          frameBorder="0"
          height="850px"
          src="https://onecompiler.com/embed/python?codeChangeEvent=true"
          width="100%"
        ></iframe>
    </div>
  );
};

export default CodeEditor;

export interface Context {
  trackId: string;
}

export const writeInfo = (message: string, context: Context) => {
  writeCore(message, "Information", context);
};

export const writeError = (message: string, context: Context) => {
  writeCore(message, "Error", context);
};

export const writeWarning = (message: string, context: Context) => {
  writeCore(message, "Warning", context);
};

const writeCore = (
  message: string,
  level: "Information" | "Error" | "Warning",
  context: Context
) => {
  let writer: Writer;

  switch (level) {
    case "Error": {
      writer = console.error;
      break;
    }
    case "Information": {
      writer = console.log;
      break;
    }
    case "Warning": {
      writer = console.warn;
      break;
    }
  }

  writer(JSON.stringify({
    message,
    level,
    data: context,
  }, undefined, 2));
};

type Writer = typeof console.log | typeof console.error | typeof console.warn;

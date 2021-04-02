const EsbuildJest = require("esbuild-jest");

const transform = {
  canInstrument: true,
  createTransformer(options) {
    options.jsxFactory = "_c";
    options.jsxFragment = "_f";

    const transformer = EsbuildJest.createTransformer(options);

    return {
      process(content, filename, config, opts) {
        if (filename.endsWith("sx")) {
          content = `import { Fragment as _f , createElement as _c} from 'react';
          ${content}`;
        }

        return transformer.process(content, filename, config, opts);
      },
    };
  },
};
module.exports = transform;
//
// const transformer = EsbuildJest.createTransformer({
//   jsxFactory: "_c",
//   jsxFragment: "_f",
// });
//
// module.exports = {
//   process(content, filename, config, opts) {
//     if (filename.endsWith("sx")) {
//       content = `import { Fragment as _f , createElement as _c} from 'react';
//           ${content}`;
//     }
//
//     return transformer.process(content, filename, config, opts);
//   },
// };

import jc from 'json-cycle';
import ObjetToString from 'stringify-object';

export enum Colors {
  TRUE = '#1f924a',
  FALSE = '#f55442',
  NUMBER = '#368aa3',
  STRING = '#c3e88d',
  GRAY = '#807b7a',
  ERROR = '#ff0000',
}

export type ColoredElement = RecursiveColoredElement | StringColoredElement;

export interface RecursiveColoredElement {
  content: ColoredElement[];
  color?: Colors;
}

export interface StringColoredElement {
  content: string;
  color?: Colors;
}

const isPromise = (promiseToCheck: Promise<any>) => {
  return (
    !!promiseToCheck &&
    (typeof promiseToCheck === 'object' || typeof promiseToCheck === 'function') &&
    typeof promiseToCheck.then === 'function'
  );
};

export function flattenColoredElement(element: ColoredElement): StringColoredElement[] {
  if (typeof element.content == 'string')
    return [
      {
        content: element.content,
        color: element.color
      }
    ];

  return element.content
    .map((it) => {
      if (typeof it.content == 'string') return it as StringColoredElement;

      return (it as RecursiveColoredElement).content
        .map((recursive) => flattenColoredElement(recursive))
        .flat();
    })
    .flat();
}
export async function stringify(element: any) {
  if (element === "__newline__") return {
    content: '\n',
    color: Colors.GRAY

  }
  if (Array.isArray(element)) {
    return {
      content: [
        {
          content: '(',
          color: Colors.GRAY
        },
        {
          content: element.length.toString(),
          color: Colors.NUMBER
        },
        {
          content: ') ',
          color: Colors.GRAY
        },
        {
          content: '[',
          color: Colors.GRAY
        },
        ...element
          .map((it, index) => {
            if (index + 1 == element.length) return stringify(it);

            return [
              stringify(it),
              {
                content: ', ',
                color: Colors.GRAY
              }
            ];
          })
          .flat(),
        {
          content: ']',
          color: Colors.GRAY
        }
      ]
    };
  }

  if (isPromise(element)) {
    const waited = await element;
    const xd = Object.getPrototypeOf(element).toString().includes('Promise');
    const sd = Object.getPrototypeOf(waited).toString().includes('Response')
    return {
      content: xd && sd ? 'Promise { <pending> }' : ObjetToString(waited),
      color: Colors.STRING
    };
  }

  if (element === true) {
    return {
      content: 'true',
      color: Colors.TRUE
    };
  }

  if (element === false) {
    return {
      content: 'false',
      color: Colors.FALSE
    };
  }

  if (typeof element == 'number') {
    return {
      content: element.toString(),
      color: Colors.NUMBER
    };
  }

  if (typeof element == 'object') {
    return {
      content: ObjetToString(jc.decycle(element)),
      color: Colors.GRAY
    };
  }

  if (typeof element == 'string') {
    return {
      content: `"${element}"`,
      color: Colors.STRING
    };
  }

  if (typeof element == 'symbol') {
    return {
      content: [
        {
          content: 'Symbol(',
          color: Colors.GRAY
        },
        await stringify(element.description),
        {
          content: ')',
          color: Colors.GRAY
        }
      ]
    };
  }

  if (typeof element == 'bigint') {
    return {
      content: `${element}n`,
      color: Colors.NUMBER
    };
  }

  if (element === undefined) {
    return {
      content: 'undefined',
      color: Colors.GRAY
    };
  }

  if (element === null) {
    return {
      content: 'null',
      color: Colors.GRAY
    };
  }

  return {
    content: element.toString(),
    color: Colors.GRAY
  };
}



// export function stringify(element: any): ColoredElement {
//   if (element === "__newline__") return {
//     content: '\n',
//     color: Colors.GRAY

//   }
//   if (Array.isArray(element)) {
//     return {
//       content: [
//         {
//           content: '(',
//           color: Colors.GRAY
//         },
//         {
//           content: element.length.toString(),
//           color: Colors.NUMBER
//         },
//         {
//           content: ') ',
//           color: Colors.GRAY
//         },
//         {
//           content: '[',
//           color: Colors.GRAY
//         },
//         ...element
//           .map((it, index) => {
//             if (index + 1 == element.length) return stringify(it);

//             return [
//               stringify(it),
//               {
//                 content: ', ',
//                 color: Colors.GRAY
//               }
//             ];
//           })
//           .flat(),
//         {
//           content: ']',
//           color: Colors.GRAY
//         }
//       ]
//     };
//   }

//   if (isPromise(element)) {

//     console.log()
//     return {
//       content: 'Promise',
//       color: Colors.GRAY
//     };
//   }

//   if (element === true) {
//     return {
//       content: 'true',
//       color: Colors.TRUE
//     };
//   }

//   if (element === false) {
//     return {
//       content: 'false',
//       color: Colors.FALSE
//     };
//   }

//   if (typeof element == 'number') {
//     return {
//       content: element.toString(),
//       color: Colors.NUMBER
//     };
//   }

//   if (typeof element == 'object') {
//     return {
//       content: ObjetToString(jc.decycle(element)),
//       color: Colors.GRAY
//     };
//   }

//   if (typeof element == 'string') {
//     return {
//       content: `"${element}"`,
//       color: Colors.STRING
//     };
//   }

//   if (typeof element == 'symbol') {
//     return {
//       content: [
//         {
//           content: 'Symbol(',
//           color: Colors.GRAY
//         },
//         stringify(element.description),
//         {
//           content: ')',
//           color: Colors.GRAY
//         }
//       ]
//     };
//   }

//   if (typeof element == 'bigint') {
//     return {
//       content: `${element}n`,
//       color: Colors.NUMBER
//     };
//   }

//   if (element === undefined) {
//     return {
//       content: 'undefined',
//       color: Colors.GRAY
//     };
//   }

//   if (element === null) {
//     return {
//       content: 'null',
//       color: Colors.GRAY
//     };
//   }

//   return {
//     content: element.toString(),
//     color: Colors.GRAY
//   };
// }
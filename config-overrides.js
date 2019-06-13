/**
 *
 * name: config-overrides
 * date: 2019-05-08
 * author: cengfucheng
 * about: 重写（自定义添加配置）
 *
 *
 */

const path = require('path');
const fs = require('fs');

const { override, fixBabelImports, addLessLoader, addWebpackAlias, addBabelPlugins, useBabelRc, addDecoratorsLegacy, disableEsLint} = require("customize-cra");
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcssAspectRatioMini = require('postcss-aspect-ratio-mini')
const postcssPxToViewport = require('postcss-px-to-viewport')
const postcssWriteSvg = require('postcss-write-svg')
const postcssCssnext = require('postcss-cssnext')
const postcssViewportUnits = require('postcss-viewport-units')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer');


function resolve(dir,...more) {

    // ...Array.from(arguments)     // arguments方式
    let type = Object.prototype.toString.call(dir);
    let typeName = type.slice(8, type.length-1);
    if(typeName == 'Object') return path.resolve({...dir},...more);
    if(typeName == 'Array') return path.resolve([...dir],...more);
    if(typeName == 'String') return path.resolve(dir,...more);
    console.error('路径不合法');
    process.exit();

}


console.log(process.env.NODE_ENV,1111111111)

let aliasList = {
    '@': resolve('src'),
};

// process.env.GENERATE_SOURCEMAP = "false";


const addMyName = () => (config) => {
    // 自定义回调函数


    let plugins = [
        // new CopyWebpackPlugin([         // 添加静态文件地址
        //     {
        //         from: resolve('static'),
        //         to: resolve('build', 'static'),
        //         type: 'dir',
        //         ignore: [
        //             '.DS_Store'
        //         ]
        //     }
        // ])
    ]

    let rules = {
        loader: require.resolve('postcss-loader'),
        options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                    browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9' // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009'
                }),
                postcssAspectRatioMini({}),
                postcssPxToViewport({
                    viewportWidth: 750, // (Number) The width of the viewport.
                    viewportHeight: 1334, // (Number) The height of the viewport.
                    unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
                    viewportUnit: 'vw', // (String) Expected units.
                    selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
                    minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
                    mediaQuery: false // (Boolean) Allow px to be converted in media queries.
                }),
                postcssWriteSvg({
                    utf8: false
                }),
                postcssCssnext({}),
                postcssViewportUnits({}),
                cssnano({
                    preset: 'advanced',
                    autoprefixer: false,
                    'postcss-zindex': false
                })
            ]
        }
    }

    require('react-app-rewire-postcss')(config, {
        plugins: loader => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
            }),
            require('postcss-aspect-ratio-mini')({}),
            require('postcss-px-to-viewport')({
                viewportWidth: 750, // (Number) The width of the viewport.
                viewportHeight: 1334, // (Number) The height of the viewport.
                unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
                viewportUnit: 'vw', // (String) Expected units.
                selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
                minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
                mediaQuery: false // (Boolean) Allow px to be converted in media queries.
            }),
            require('postcss-write-svg')({
                utf8: false
            }),
            require('postcss-viewport-units')({}),
            require('cssnano')({
                preset: "advanced",
                autoprefixer: false,
                "postcss-zindex": false
            })
        ]
    });
    // config.module.rules[1].oneOf.push(rules);
    console.log('配置模块 ',config.module.rules, typeof config.module.rules)

    // 输出配置到根目录 src下，供查看
    let writeFile = fs.createWriteStream('output.js');
    writeFile.write(JSON.stringify(config, null, 4),'utf8');

    config.plugins = [...config.plugins,...plugins];

    return config;
}
module.exports = override(
    ...addBabelPlugins(
        // "polished",
        // "emotion",
        // "babel-plugin-transform-do-expressions",
        // "babel-plugin-import"
    ),
    fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css', // `style: true` 会加载 less 文件，就修改了 antd的less样式
            // style: true
        }
    ),
    addLessLoader({
        strictMath: true,
        noIeCompat: true,
        localIdentName: '[local]--[hash:base64:5]' // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
    }),
    addWebpackAlias({...aliasList}),
    // useBabelRc(),           //  使用装饰器, 这种需要配置 babel
                                // 配置 .babelrc 文件
                                //{
                                //   "presets": ["module:metro-react-native-babel-preset"],
                                //   "plugins": [
                                //     [
                                //       "@babel/plugin-proposal-decorators",
                                //       {
                                //         "legacy": true
                                //       }
                                //     ]
                                //   ]
                                // }
    addDecoratorsLegacy(),      //  使用装饰器， 这种不需要配置 babel  , 尤其 mobx 需要装饰器
    disableEsLint(),            //  禁止eslint，mobx 语法不规范，禁止有好处
    addMyName()
)



// 未使用 customize-cra 方式
// module.exports = {
//     webpack: (config) => {
//         // console.log(config,11111);
//         console.log(config.entry,1234)
//         // 修改进口配置
//         config.entry.forEach((v, i) =>
// const { override, fixBabelImports, addLessLoader, addWebpackAlias} = require("customize-cra"); {
//             console.log(v,i,1234)
//             // if(v.indexOf(main.js) != -1) {
//             //     config.entry[i] = resolve('src','main.js');
//             // }
//         })
//
//         // 增加别名配置
//         config.resolve.alias = {
//             ...config.resolve.alias,
//             ...aliasList
//         }
//
//         let writeFile = fs.createWriteStream('output.js');
//         writeFile.write(JSON.stringify(config, null, 4),'utf8');
//         return config;
//     }
// }
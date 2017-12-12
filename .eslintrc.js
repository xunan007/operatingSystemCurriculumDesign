// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',
    // required to lint *.vue files
    plugins: ['html'],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        //默认代码结束处强制换行，关闭
        'eol-last': 0,
        //函数参数前不留括号
        'space-before-function-paren': 0,
        //不允许语句后存在多余的空格，关闭
        'no-trailing-spaces': 0,
        //缩进
        indent: [2, 4],
        //使用分号
        semi: ['error', 'always'],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
};

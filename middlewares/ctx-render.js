module.exports = async function (ctx, next) {
  console.log('ctx.render@init', ctx)
  ctx.render = async (tpl, data, page) => {
    if (typeof ctx.body !== 'undefined')
      console.warn(`'ctx.body' has been assigned: ${ctx.body}`)

    const Template = ctx.$tpls[tpl]
    const template = new Template({data, page})

    ctx.set('Content-Type', 'text/html; charset=utf-8')
    ctx.body = await template.toHtml()
  }
  await next()
}


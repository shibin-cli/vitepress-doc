import fs from 'fs'
import path from 'path'
import type MarkdownIt from 'markdown-it'
import mdContainer from 'markdown-it-container'
import type Renderer from 'markdown-it/lib/renderer'
import type Token from 'markdown-it/lib/token'

import { ApiTableContainer, tableWrapper } from './apiTable'

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer,
  ): string
}

export default function mdPlugin(md: MarkdownIt) {
  md.use(tableWrapper)
  md.use(mdContainer, 'demo', {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve('./docs', 'examples', `${sourceFile}.vue`),
            'utf-8',
          )
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)

        return `<demo :demos="demos" source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``),
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source,
        )}" description="${encodeURIComponent(md.render(description))}">`
      } else {
        return '</demo>'
      }
    },
  } as ContainerOpts)
  md.use(ApiTableContainer)
}

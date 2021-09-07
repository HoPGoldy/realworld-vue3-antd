// markdown 编辑器
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, { Hljs: hljs })
VMdPreview.use(githubTheme, { Hljs: hljs })

export { VMdEditor, VMdPreview }

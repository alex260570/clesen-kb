import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} aria-label={title} class="brand-link">
        <img src={`${baseDir}/static/clesen-logo.png`} alt="Clesen Wholesale" class="brand-logo" />
        <span class="brand-subtitle">Knowledge Base</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  margin: 0 0 0.9rem;
  font-family: var(--titleFont);
}

.page-title .brand-link {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: fit-content;
  max-width: 100%;
  padding: 0.1rem 0;
  color: var(--dark);
}

.page-title .brand-logo {
  display: block;
  width: min(210px, 100%);
  height: auto;
}

.page-title .brand-subtitle {
  display: block;
  color: var(--secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

:root[saved-theme="dark"] .page-title .brand-link {
  background: #ffffff;
  border-radius: 6px;
  padding: 0.55rem 0.7rem 0.65rem;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor

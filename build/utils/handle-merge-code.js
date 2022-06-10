export default function handleMergeCode({ parts, mergedParts, isVue }) {
  if (isVue && parts.language === 'ts') {
    if (parts.template) {
      const template = `<template>${parts.template}</template>`
      mergedParts.tsCode += template
      mergedParts.jsCode += template
    }
    if (parts.script) {
      if (parts.template) {
        mergedParts.tsCode += `\n\n`
        mergedParts.jsCode += `\n\n`
      }
      mergedParts.tsCode += `
        <script lang="ts">
          ${parts.script}
        </script>`
      mergedParts.jsCode += `
        <script>
        </script>`
    }

    if (parts.style) {
      if (parts.template || parts.script) {
        mergedParts.tsCode += `\n\n`
        mergedParts.jsCode += `\n\n`
      }
      const style = `<style scoped>${parts.style}</style>`
      mergedParts.tsCode += style
      mergedParts.jsCode += style
    }
  } else {
    if (parts.template) {
      const template = isVue
        ? `<template>${parts.template}</template>`
        : `
      <template>
        ${parts.template
          .split('\n')
          .map((line) => (line.length ? `  ${line}` : line))
          .join('\n')}
      </template>`
      mergedParts.jsCode += template
    }
    if (parts.script) {
      if (parts.template) {
        mergedParts.jsCode += `\n\n`
      }
      mergedParts.jsCode += `
      <script>
        ${parts.script}
      </script>`
    }

    if (parts.style) {
      if (parts.template || parts.script) {
        mergedParts.jsCode += `\n\n`
      }
      const style = isVue
        ? `<style scoped>${parts.style}</sctyle>`
        : `
      <style scoped>
        ${parts.style}
      </style>`
      mergedParts.jsCode += style
    }
  }
}

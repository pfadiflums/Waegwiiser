import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-rich-text-renderer',
  imports: [],
  template: `
    <div class="rich-text">
      @for (node of content()?.root?.children; track $index) {
        @switch (node.type) {
          @case ('paragraph') {
            <p [style.text-align]="node.format" [style.text-indent]="node.indent + 'px'">
              @for (textNode of node.children; track $index) {
                @if (textNode.type === 'text') {
                  <span [class]="getTextClasses(textNode)">{{ textNode.text }}</span>
                } @else if (textNode.type === 'link') {
                   <a [href]="textNode.fields?.url" [target]="textNode.fields?.newTab ? '_blank' : '_self'">
                     @for (linkTextNode of textNode.children; track $index) {
                       <span [class]="getTextClasses(linkTextNode)">{{ linkTextNode.text }}</span>
                     }
                   </a>
                }
              }
            </p>
          }
          @case ('heading') {
            @switch (node.tag) {
              @case ('h1') { <h1 [style.text-align]="node.format">{{ getChildrenText(node) }}</h1> }
              @case ('h2') { <h2 [style.text-align]="node.format">{{ getChildrenText(node) }}</h2> }
              @case ('h3') { <h3 [style.text-align]="node.format">{{ getChildrenText(node) }}</h3> }
              @case ('h4') { <h4 [style.text-align]="node.format">{{ getChildrenText(node) }}</h4> }
              @case ('h5') { <h5 [style.text-align]="node.format">{{ getChildrenText(node) }}</h5> }
              @case ('h6') { <h6 [style.text-align]="node.format">{{ getChildrenText(node) }}</h6> }
            }
          }
          @case ('list') {
            @if (node.listType === 'bullet') {
              <ul>
                @for (listItem of node.children; track $index) {
                  <li>{{ getChildrenText(listItem) }}</li>
                }
              </ul>
            } @else {
              <ol>
                @for (listItem of node.children; track $index) {
                  <li>{{ getChildrenText(listItem) }}</li>
                }
              </ol>
            }
          }
          @case ('quote') {
            <blockquote>{{ getChildrenText(node) }}</blockquote>
          }
        }
      }
    </div>
  `,
  styles: [`
    .rich-text {
      line-height: 1.6;
      p { margin-bottom: 1rem; }
      h1, h2, h3, h4, h5, h6 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 700;
        line-height: 1.2;
      }
      ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
      li { margin-bottom: 0.5rem; }
      blockquote {
        border-left: 4px solid var(--primary);
        padding-left: 1rem;
        font-style: italic;
        margin-bottom: 1rem;
      }
      .bold { font-weight: 700; }
      .italic { font-style: italic; }
      .underline { text-decoration: underline; }
      .strikethrough { text-decoration: line-through; }
      a { color: var(--primary); text-decoration: underline; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextRendererComponent {
  content = input<any>();

  getTextClasses(node: any): string {
    const classes = [];
    if (node.format & 1) classes.push('bold');
    if (node.format & 2) classes.push('italic');
    if (node.format & 4) classes.push('strikethrough');
    if (node.format & 8) classes.push('underline');
    return classes.join(' ');
  }

  getChildrenText(node: any): string {
    if (!node.children) return '';
    return node.children.map((child: any) => {
      if (child.type === 'text') return child.text;
      if (child.children) return this.getChildrenText(child);
      return '';
    }).join('');
  }
}

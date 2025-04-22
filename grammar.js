/**
 * @file bitmark Bit is used to describe shareable, self-contained, interactive quiz or static content bits
 * @author Get More Brain <richard.sewell@getmorebrain.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'bitmark',

  extras: $ => [
    /\s/,
  ],

  rules: {
    document: $ => repeat($._block),

    _block: $ => $.bit_block,

    bit_block: $ => seq(
      $.bit_header,
      repeat(choice($._inline, $.block_tag))
    ),

    bit_header: $ => seq(
      '[.',
      field('bit_type', $.bit_type),
      optional(seq(
        ':',
        field('text_format', $.text_format),
      )),
      optional(seq(
        '&',
        field('resource', $.resource_type),
      )),
      ']'
    ),

    bit_type: $ => choice(
      'article',
      'summary',
      'extractor-ai-chat',
      'note',
      // Add other valid bits here
      // Generic types
      /[a-zA-Z][a-zA-Z0-9_-]*/
    ),

    text_format: $ => choice(
      'bitmark--',
      'bitmark++'
    ),

    resource_type: $ => choice(
      'image',
      'video'
    ),

    block_tag: $ => choice(
      $.instruction_block_tag,
      $.hint_block_tag,
    ),

    _inline: $ => choice(
      $.italic,
      $.formula_inline,
      $.superscript,
      $.subscript,
      $.gap,
      $.text,
    ),


    // Block tags

    instruction_block_tag: $ =>
      seq('[!', field('instruction', $.bitmark_minus_text), ']'),
    
    hint_block_tag: $ =>
      seq('[?', field('hint', $.bitmark_minus_text), ']'),

    bitmark_minus_text: $ => repeat1($.text),  // You may refine this further

    gap: $ =>
      seq('[_', field('gap', $.plain_text), ']'),
    

    // Inline formatting

    bold: $ => seq('**', repeat1($.text), '**'),
    italic: $ => seq('__', repeat1($.text), '__'),
    formula_inline: $ => seq('==', repeat1($.text), '==|latex|'),
    superscript: $ => seq('==', repeat1($.text), '==|superscript|'),
    subscript: $ => seq('==', repeat1($.text), '==|subscript|'),

    plain_text: $ => repeat1($.text),  // Could be stricter if needed

    text: $ => token(prec(-1, /[^\s*=_|\[\]]+/)),
  }
});
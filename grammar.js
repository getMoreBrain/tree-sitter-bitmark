// grammar.js  –  Tree‑sitter grammar for Bitmark
// ------------------------------------------------
// Generated 2025‑04‑22 from the original Peggy grammar
// (c) 2023‑2025 Get More Brain AG
// ------------------------------------------------

module.exports = grammar({
  name: "bitmark",

  // Turn off error recovery
  hygiene_variable_analysis: false,

  externals: ($) => [
    // Delimiters. NOTE: They must be the same number and order as in scanner.c
    $.delimiter_bold_open,
    $.delimiter_bold_close,
    $.delimiter_italic_open,
    $.delimiter_italic_close,
    $.delimiter_inline_open,
    $.delimiter_inline_close,
    $.bracket_left_not_bit_tag,
  ],

  extras: ($) => [
    /[\r\f]+/, // Drop carriage returns and form feeds
  ],
  // extras: ($) => [],

  rules: {
    source_file: ($) =>
      repeat(
        // optional($.preamble), // leading lines at start allowed, will be ignored
        field("bit", $.bit)
      ),

    bit_header: ($) =>
      seq(
        $.bracket_left_bit,
        field("bit_type", $.bit_type),
        optional(seq(":", field("text_format", $.text_format))),
        optional(seq("&", field("resource", $.resource_type))),
        $.bracket_right
        // optional("\n")
      ),

    bit_type: ($) => choice("article", /[a-zA-Z][a-zA-Z0-9-]*/),
    text_format: ($) => choice("bitmark--", "bitmark++"),
    resource_type: ($) => choice("image", "video"),

    bit: ($) =>
      seq(
        field("header", $.bit_header),
        field(
          "body",
          repeat(choice($.tag_chain, $.bold, $.italic, $.inline, $.text))
        )
      ),

    // Right‑associative ⇒ keep swallowing `bit_tag`s
    // tag_chain: ($) =>
    //   prec.right(repeat1(field("tag", $.bit_tag))),

    tag_chain: ($) =>
      choice(
        field(
          "item_lead_pageNo_marginNo_chain",
          $.item_lead_pageNo_marginNo_chain
        ),
        field("hint", $.hint_tag),
        field("instruction", $.instruction_tag),
        field("property", $.property_tag),
        field("title", $.title_tag),
        field("anchor", $.anchor_tag),
        field("reference", $.reference_tag),
        field("gap", $.gap_tag),
        field("mark", $.mark_tag),
        field("sample_solution", $.sample_solution_tag),
        field("true", $.true_tag),
        field("false", $.false_tag),
        field("resource", $.resource_tag)
      ),

    item_lead_pageNo_marginNo_chain: ($) =>
      prec.right(
        choice(
          field("item", $.item_lead_tag),
          seq(field("item", $.item_lead_tag), field("lead", $.item_lead_tag)),
          seq(
            field("item", $.item_lead_tag),
            field("lead", $.item_lead_tag),
            field("pageNo", $.item_lead_tag)
          ),
          seq(
            field("item", $.item_lead_tag),
            field("lead", $.item_lead_tag),
            field("pageNo", $.item_lead_tag),
            field("marginNo", $.item_lead_tag)
          )
        )
      ),
    // prec.right(repeat1(field("tag", $.bit_tag))),

    hint_tag: ($) => field("hint", $.hint_tag),
    instruction_tag: ($) => field("hint", $.instruction_tag),

    bold: ($) =>
      field(
        "bold",
        seq($.delimiter_bold, repeat1($.text), $.delimiter_bold)
      ),
    italic: ($) =>
      field(
        "italic",
        seq($.delimiter_italic, repeat1($.text), $.delimiter_italic)
      ),
    // inline: ($) =>
    //   field(
    //     "inline",
    //     seq(
    //       $.delimiter_inline,
    //       repeat1($.text),
    //       $.delimiter_inline,
    //       $.delimiter_inline_property,
    //       repeat1(seq($.identifier, $.delimiter_inline_property)),
    //     )
    //   ),

    inline: ($) =>
      field(
        "inline",
        seq(
          $.delimiter_inline,
          repeat1($.text),
          $.delimiter_inline,
          $.inline_property_list
        )
      ),

    inline_property_list: ($) =>
      seq(
        $.delimiter_inline_property,
        repeat1(
          seq(
            choice(
              field("bold", $.style_bold),
              field("italic", $.style_italic),
              field("light", $.style_light),
              field("highlight", $.style_highlight),
              field("strike", $.style_strike),
              field("subscript", $.style_subscript),
              field("superscript", $.style_superscript),
              field("ins", $.style_ins),
              field("del", $.style_del),
              field("underline", $.style_underline),
              field("doubleUnderline", $.style_doubleUnderline),
              field("circle", $.style_circle),
              field("languageEm", $.style_languageEm),
              field("userUnderline", $.style_userUnderline),
              field("userDoubleUnderline", $.style_userDoubleUnderline),
              field("userStrike", $.style_userStrike),
              field("userCircle", $.style_userCircle),
              field("userHighlight", $.style_userHighlight),
              field("notranslate", $.style_notranslate)
            ),
            $.delimiter_inline_property
          )
        )
      ),

    property_tag: ($) =>
      seq(
        $.bracket_left_property,
        $.identifier,
        optional(seq(":", $.tag_value)),
        $.bracket_right
      ),
    title_tag: ($) =>
      seq(
        $.bracket_left_title,
        repeat("#"),
        optional($.tag_value),
        $.bracket_right
      ),
    anchor_tag: ($) =>
      seq($.bracket_left_anchor, optional($.tag_value), $.bracket_right),
    reference_tag: ($) =>
      seq($.bracket_left_reference, optional($.tag_value), $.bracket_right),
    item_lead_tag: ($) =>
      seq($.bracket_left_item_lead, optional($.tag_value), $.bracket_right),
    instruction_tag: ($) =>
      seq($.bracket_left_instruction, optional($.tag_value), $.bracket_right),
    hint_tag: ($) =>
      seq($.bracket_left_hint, optional($.tag_value), $.bracket_right),
    true_tag: ($) =>
      seq($.bracket_left_true, optional($.tag_value), $.bracket_right),
    false_tag: ($) =>
      seq($.bracket_left_false, optional($.tag_value), $.bracket_right),
    sample_solution_tag: ($) =>
      seq(
        $.bracket_left_sample_solution,
        optional($.tag_value),
        $.bracket_right
      ),
    gap_tag: ($) =>
      seq($.bracket_left_gap, optional($.tag_value), $.bracket_right),
    mark_tag: ($) =>
      seq($.bracket_left_mark, optional($.tag_value), $.bracket_right),
    resource_tag: ($) =>
      seq(
        $.bracket_left_resource,
        $.identifier,
        optional(seq(":", $.tag_value)),
        $.bracket_right
      ),

    text: ($) =>
      field(
        "text",
        choice(
          // $.text_fragment_bracket_left,
          $.bracket_left_not_bit_tag,
          $.text_fragment_asterisk,
          $.text_fragment_underscore,
          $.text_fragment_equals,
          $.text_fragment_pipe,
          $.text_fragment
        )
      ),

    style_bold: ($) => "bold",
    style_italic: ($) => "italic",
    style_light: ($) => "light",
    style_highlight: ($) => "highlight",
    style_strike: ($) => "strike",
    style_subscript: ($) => "subscript",
    style_superscript: ($) => "superscript",
    style_ins: ($) => "ins",
    style_del: ($) => "del",
    style_underline: ($) => "underline",
    style_doubleUnderline: ($) => "doubleUnderline",
    style_circle: ($) => "circle",
    style_languageEm: ($) => "languageEm",
    style_userUnderline: ($) => "userUnderline",
    style_userDoubleUnderline: ($) => "userDoubleUnderline",
    style_userStrike: ($) => "userStrike",
    style_userCircle: ($) => "userCircle",
    style_userHighlight: ($) => "userHighlight",
    style_notranslate: ($) => "notranslate",

    bracket_left_bit: ($) => "[.",
    bracket_left_property: ($) => "[@",
    bracket_left_title: ($) => "[#",
    bracket_left_anchor: ($) => "[▼",
    bracket_left_reference: ($) => "[►",
    bracket_left_item_lead: ($) => "[%",
    bracket_left_instruction: ($) => "[!",
    bracket_left_hint: ($) => "[?",
    bracket_left_true: ($) => "[+",
    bracket_left_false: ($) => "[-",
    bracket_left_sample_solution: ($) => "[$",
    bracket_left_gap: ($) => "[_",
    bracket_left_mark: ($) => "[=",
    bracket_left_resource: ($) => "[&",
    bracket_left: ($) => "[",
    bracket_right: ($) => "]",

    delimiter_bold: ($) => "**",
    delimiter_italic: ($) => "__",
    delimiter_inline: ($) => "==",
    delimiter_inline_property: ($) => "|",

    text_fragment_bracket_left: (_) => "[",
    text_fragment_asterisk: (_) => "*",
    text_fragment_underscore: (_) => "_",
    text_fragment_equals: (_) => "=",
    text_fragment_pipe: (_) => "|",
    text_fragment: (_) => token(/[^\[\*_=\|]+/),
    tag_value: (_) => token(/(?:\^\]|[^\]])+/),
    identifier: (_) => /[a-zA-Z][a-zA-Z0-9_-]*/,

    // empty_line: ($) => seq(repeat1($.newline), optional(repeat1($.text_line))),

    // newline: (_) => "\n",
    // text_line: ($) => /[^\n]+/,
    // whitespace_newline: ($) => /[ \t]*\n/,
  },
});

// grammar.js  –  Tree‑sitter grammar for Bitmark
// ------------------------------------------------
// Generated 2025‑04‑22 from the original Peggy grammar
// (c) 2023‑2025 Get More Brain AG
// ------------------------------------------------

module.exports = grammar({
  name: "bitmark",

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
        "[.",
        field("bit_type", $.bit_type),
        optional(seq(":", field("text_format", $.text_format))),
        optional(seq("&", field("resource", $.resource_type))),
        "]"
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
          repeat(
            choice(
              $.tag_chain,
              choice(
                $.bold,
                $.italic,
                $.text
              )
            )
          )
        )
      ),

    // Right‑associative ⇒ keep swallowing `bit_tag`s
    tag_chain: ($) =>
      prec.right(repeat1(field("tag", $.bit_tag))),

    bold: ($) => field("bold", seq("**", repeat1($.text), "**")),
    italic: ($) => field("italic", seq("__", repeat1($.text), "__")),

    bit_tag: ($) =>
      choice(
        field("id", $.id_tag),
        field("property", $.property_tag),
        field("title", $.title_tag),
        field("anchor", $.anchor_tag),
        field("reference", $.reference_tag),
        field("item_lead", $.item_lead_tag),
        field("instruction", $.instruction_tag),
        field("hint", $.hint_tag),
        field("gap", $.gap_tag),
        field("mark", $.mark_tag),
        field("sample_solution", $.sample_solution_tag),
        field("true", $.true_tag),
        field("false", $.false_tag),
        field("resource", $.resource_tag)
      ),

    id_tag: ($) => seq("[@id", optional(seq(":", $.tag_value)), "]"),
    property_tag: ($) =>
      seq("[@", $.identifier, optional(seq(":", $.tag_value)), "]"),
    title_tag: ($) => seq("[", repeat1("#"), $.tag_value, "]"),
    anchor_tag: ($) => seq("[▼", $.tag_value, "]"),
    reference_tag: ($) => seq("[►", $.tag_value, "]"),
    item_lead_tag: ($) => seq("[%", $.tag_value, "]"),
    instruction_tag: ($) => seq("[!", $.tag_value, "]"),
    hint_tag: ($) => seq("[?", $.tag_value, "]"),
    true_tag: ($) => seq("[+", $.tag_value, "]"),
    false_tag: ($) => seq("[-", $.tag_value, "]"),
    sample_solution_tag: ($) => seq("[$", $.tag_value, "]"),
    gap_tag: ($) => seq("[_", $.tag_value, "]"),
    mark_tag: ($) => seq("[=", $.tag_value, "]"),
    resource_tag: ($) =>
      seq("[&", $.identifier, optional(seq(":", $.tag_value)), "]"),

    text: ($) => field("text",
      choice(
        $.text_fragment_left_bracket,
        $.text_fragment_asterisk,
        $.text_fragment_underscore,
        $.text_fragment
      )
    ),

    text_fragment_left_bracket: (_) => "[",
    text_fragment_asterisk: (_) => "*",
    text_fragment_underscore: (_) => "_",
    text_fragment: (_) => prec(-1, token(/[^\[\*_]+/)),
    tag_value: (_) => token(/(?:\^\]|[^\]])+/),
    identifier: (_) => /[a-zA-Z][a-zA-Z0-9_-]*/,

    // empty_line: ($) => seq(repeat1($.newline), optional(repeat1($.text_line))),

    // newline: (_) => "\n",
    // text_line: ($) => /[^\n]+/,
    // whitespace_newline: ($) => /[ \t]*\n/,
  },
});

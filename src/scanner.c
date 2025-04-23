#include <tree_sitter/parser.h>
#include <wctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

enum TokenType
{
    // DELIMITER_BOLD_OPEN,
    // DELIMITER_BOLD_CLOSE,
    // DELIMITER_ITALIC_OPEN,
    // DELIMITER_ITALIC_CLOSE,
    // DELIMITER_INLINE_OPEN,
    // DELIMITER_INLINE_CLOSE,
    BRACKET_LEFT_NOT_BIT_TAG
};

typedef struct
{
    bool in_bold;
    bool in_italic;
    bool in_inline;
    // add whatever flags / counters you need
} Scanner;

static inline void advance(TSLexer *lexer) { lexer->advance(lexer, false); }
static inline void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

static bool inInlineTag(Scanner *s)
{
    if (s->in_bold || s->in_italic || s->in_inline)
        return true;
    return false;
}

// bool tree_sitter_bitmark_external_scanner_scan(void *payload,
//     TSLexer *lexer,
//     const bool *valid_symbols)
// {
//   if (!valid_symbols[BRACKET_LEFT_NOT_BIT_TAG]) return false;

//   // 1. First char must be '['
//   if (lexer->lookahead != '[') return false;
//   advance(lexer);                      // consume '['

//   // 2. Peek at the very next char **without** consuming it
//   if (lexer->lookahead != '.') return false; // reserved opener – abort

//   // 3. Accept the single '[' as a token
//   lexer->mark_end(lexer);              // token ends here

//   lexer->result_symbol = BRACKET_LEFT_NOT_BIT_TAG;
//   return true;                         // success, no more advancing
// }

bool tree_sitter_bitmark_external_scanner_scan(void *payload,
                                               TSLexer *lexer,
                                               const bool *valid)
{
    // fprintf(stderr, "scanner: %c (0x%02X)\n", lexer->lookahead, lexer->lookahead);

    Scanner *s = (Scanner *)payload;

    // if (valid[DELIMITER_BOLD_OPEN] &&
    //     lexer->lookahead == '*' && !inInlineTag(s))
    // {

    //     lexer->mark_end(lexer); // token ends at start
    //     advance(lexer);         // Consume the first '*'
    //     if (lexer->lookahead != '*')
    //         return false; // Not a bold tag, abort
    //     advance(lexer);   // consume the second '*'

    //     lexer->mark_end(lexer); // token ends at start
    //     lexer->result_symbol = DELIMITER_BOLD_OPEN;
    //     s->in_bold = true; // save state
    //     return true;
    // }

    // if (valid[DELIMITER_BOLD_CLOSE] &&
    //     lexer->lookahead == '*' && s->in_bold)
    // {

    //     lexer->mark_end(lexer); // token ends at start
    //     advance(lexer);         // Consume the first '*'
    //     if (lexer->lookahead != '*')
    //         return false; // Not a bold tag, abort
    //     advance(lexer);   // consume the second '*'

    //     lexer->mark_end(lexer); // token ends at start
    //     lexer->result_symbol = DELIMITER_BOLD_CLOSE;
    //     s->in_bold = false; // save state
    //     return true;
    // }

    // if (valid[DELIMITER_ITALIC_OPEN] &&
    //     lexer->lookahead == '_' && !inInlineTag(s))
    // {

    //     lexer->mark_end(lexer); // token ends at start
    //     advance(lexer);         // Consume the first '_'
    //     if (lexer->lookahead != '_')
    //         return false; // Not a bold tag, abort
    //     advance(lexer);   // consume the second '_'

    //     lexer->mark_end(lexer); // token ends at start
    //     lexer->result_symbol = DELIMITER_ITALIC_OPEN;
    //     s->in_italic = true; // save state
    //     return true;
    // }

    // if (valid[DELIMITER_ITALIC_CLOSE] &&
    //     lexer->lookahead == '_' && s->in_italic)
    // {

    //     lexer->mark_end(lexer); // token ends at start
    //     advance(lexer);         // Consume the first '_'
    //     if (lexer->lookahead != '_')
    //         return false; // Not a bold tag, abort
    //     advance(lexer);   // consume the second '_'

    //     lexer->mark_end(lexer); // token ends at start
    //     lexer->result_symbol = DELIMITER_ITALIC_CLOSE;
    //     s->in_italic = false; // save state
    //     return true;
    // }

    // if (valid[DELIMITER_INLINE_OPEN] &&
    //     lexer->lookahead == '=' && !inInlineTag(s))
    // {

    //     lexer->mark_end(lexer); // token ends at start
    //     advance(lexer);         // Consume the first '='
    //     if (lexer->lookahead != '=')
    //         return false; // Not a bold tag, abort
    //     advance(lexer);   // consume the second '='

    //     lexer->mark_end(lexer); // token ends at start
    //     lexer->result_symbol = DELIMITER_INLINE_OPEN;
    //     s->in_inline = true; // save state
    //     return true;
    // }

    // if (valid[DELIMITER_INLINE_CLOSE] &&
    //     lexer->lookahead == '=' && s->in_inline)
    // {

    //     lexer->mark_end(lexer); // token ends at start
    //     advance(lexer);         // Consume the first '='
    //     if (lexer->lookahead != '=')
    //         return false; // Not a bold tag, abort
    //     advance(lexer);   // consume the second '='

    //     lexer->mark_end(lexer); // token ends at start
    //     lexer->result_symbol = DELIMITER_INLINE_CLOSE;
    //     s->in_inline = false; // save state
    //     return true;
    // }

    if (valid[BRACKET_LEFT_NOT_BIT_TAG] && lexer->lookahead == '[')
    {

        // Mark the start as the end of the token in case of failure
        lexer->mark_end(lexer);

        // Consume '['
        advance(lexer);

        // 2. Peek second char, must NOT be '.'
        if (lexer->lookahead == '.')
            return false; // reserved opener – abort

        // consume NOT '.'
        advance(lexer);

        // Mark the end of the token
        lexer->mark_end(lexer);

        lexer->result_symbol = BRACKET_LEFT_NOT_BIT_TAG;
        return true; // success, no more advancing
    }

    return false; // let other rules try
}

/* ---------- life-cycle ------------------------------------------------ */

void *tree_sitter_bitmark_external_scanner_create(void)
{
    return calloc(1, sizeof(Scanner)); // zero-initialised
}

void tree_sitter_bitmark_external_scanner_destroy(void *payload)
{
    free(payload);
}

/* Serialize at most 1024 bytes (Tree-sitter’s hard limit) */
unsigned tree_sitter_bitmark_external_scanner_serialize(
    void *payload, char *buffer)
{
    Scanner *s = (Scanner *)payload;
    buffer[0] = (s->in_bold ? 1 : 0);
    buffer[1] = (s->in_italic ? 1 : 0);
    buffer[2] = (s->in_inline ? 1 : 0);

    return sizeof(Scanner); // number of bytes written
}

void tree_sitter_bitmark_external_scanner_deserialize(
    void *payload, const char *buffer, unsigned length)
{
    Scanner *s = (Scanner *)payload;
    if (length >= 3)
    {
        s->in_bold = buffer[0];
        s->in_italic = buffer[1];
        s->in_inline = buffer[2];
    }
    else
    {
        /* fresh parse – start from a clean slate */
        memset(s, 0, sizeof(*s));
    }
}

//   if (valid_symbols[DELIMITER_BOLD_OPEN] && lexer->lookahead == '*')
//   {
//       int *c = 0;
//       lexer->lookahead = *c;

//       // NOTE: This code can be generic for bold, italic, etc... just the '*' is different
//       // Might be the start of a tag. If so, the tag must have an ending within this bit!

//       lexer->mark_end(lexer); // Mark the start as the end of the token in case not bold
//       advance(lexer);         // consume '*'
//       if (lexer->lookahead != '*') return false; // Not a bold tag, abort
//       advance(lexer);   // consume '*'

//       lexer->mark_end(lexer); // Mark the end of the start tag in case of failure

//       // Check the for a '**' close tag. Abort if find EOF or next bit start first.
//       for (;;) {
//           if (lexer->eof(lexer)) return false; // EOF, abort
//           if (lexer->lookahead == '[') {
//               advance(lexer); // consume '['
//               if (lexer->lookahead == '.') {
//                   return false; // Start of next bit, abort
//               }
//               continue; // Not an end tag, continue
//           }

//           if (lexer->lookahead == '*') {
//               advance(lexer); // consume '*'
//               if (lexer->lookahead == '*') {
//                   advance(lexer); // consume '*'
//                   lexer->mark_end(lexer); // Mark the end of the token
//                   lexer->result_symbol = DELIMITER_BOLD_OPEN;
//                   return true; // success, no more advancing
//               }
//               continue; // Not an end tag, continue
//           }
//       }

//       return false;
//   }

package tree_sitter_bitmark_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bitmark "github.com/getmorebrain/bitmark-parser-generator-treesitter/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bitmark.Language())
	if language == nil {
		t.Errorf("Error loading Bitmark grammar")
	}
}

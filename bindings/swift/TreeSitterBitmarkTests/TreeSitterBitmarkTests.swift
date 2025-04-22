import XCTest
import SwiftTreeSitter
import TreeSitterBitmark

final class TreeSitterBitmarkTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bitmark())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Bitmark grammar")
    }
}

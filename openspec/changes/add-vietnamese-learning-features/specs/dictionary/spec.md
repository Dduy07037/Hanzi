## MODIFIED Requirements

### Requirement: Dictionary Search
The system SHALL provide a dictionary search feature that allows users to search for Chinese words by multiple criteria including simplified/traditional characters, Pinyin, English meaning, and Vietnamese meaning.

The system SHALL prioritize displaying Vietnamese translations when available, showing them before English translations.

The system SHALL support filtering search results to show only words that have Vietnamese translations.

#### Scenario: Search with Vietnamese priority
- **WHEN** user searches for a word that has both Vietnamese and English translations
- **THEN** Vietnamese translation is displayed first and more prominently than English translation

#### Scenario: Filter by language
- **WHEN** user enables "Only show words with Vietnamese" filter
- **THEN** search results only include words that have Vietnamese translations

#### Scenario: Vietnamese search matching
- **WHEN** user searches using Vietnamese text (with or without diacritics)
- **THEN** system matches words that contain the Vietnamese text in their Vietnamese meaning field

## ADDED Requirements

### Requirement: Example Sentences
The system SHALL display example sentences for Chinese words when available.

Example sentences SHALL show the Chinese text, Pinyin, and translations in both Vietnamese and English.

#### Scenario: View example sentences
- **WHEN** user views word details for a word that has example sentences
- **THEN** system displays a section showing example sentences with Chinese text, Pinyin, and translations

#### Scenario: Search by example
- **WHEN** user searches for text that appears in an example sentence
- **THEN** system includes words whose example sentences contain the search text in the results


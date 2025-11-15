## ADDED Requirements

### Requirement: Learning Statistics Dashboard
The system SHALL provide a dashboard displaying learning statistics for authenticated users.

The dashboard SHALL show:
- Total number of words learned
- Number of flashcards reviewed today and this week
- Distribution of words by HSK level
- Learning progress over time

#### Scenario: View learning statistics
- **WHEN** authenticated user navigates to the statistics dashboard
- **THEN** system displays all learning statistics including word count, review count, and HSK distribution

#### Scenario: Progress tracking
- **WHEN** user reviews flashcards or learns new words
- **THEN** statistics are updated in real-time to reflect the new activity

### Requirement: Quiz Mode
The system SHALL provide a quiz mode where users can test their knowledge of Chinese vocabulary.

The quiz SHALL display Chinese characters or Pinyin and ask users to select the correct meaning from multiple choices.

The quiz SHALL provide immediate feedback after each question and display a final score.

#### Scenario: Start quiz
- **WHEN** user starts a quiz session
- **THEN** system displays a Chinese word (character or Pinyin) and multiple choice answers with meanings

#### Scenario: Answer quiz question
- **WHEN** user selects an answer
- **THEN** system immediately shows whether the answer is correct or incorrect, with explanation

#### Scenario: Complete quiz
- **WHEN** user completes all quiz questions
- **THEN** system displays final score and summary of correct/incorrect answers

### Requirement: Listening Practice Mode
The system SHALL provide a listening practice mode where users can practice recognizing Chinese words by sound.

The system SHALL play audio pronunciation of Chinese words and ask users to select the correct word from multiple choices.

#### Scenario: Start listening practice
- **WHEN** user starts listening practice
- **THEN** system plays audio pronunciation of a Chinese word

#### Scenario: Select word from audio
- **WHEN** user hears the pronunciation
- **THEN** system displays multiple choice options with Chinese characters and meanings
- **AND** user can select the word that matches the audio

#### Scenario: Adjust playback speed
- **WHEN** user adjusts playback speed control
- **THEN** audio plays at the selected speed

### Requirement: Writing Practice Mode
The system SHALL provide a writing practice mode where users can practice writing Chinese characters.

The system SHALL use Hanzi Writer to allow users to practice writing characters and provide feedback on accuracy.

#### Scenario: Start writing practice
- **WHEN** user starts writing practice for a character
- **THEN** system displays the character and allows user to practice writing it using Hanzi Writer

#### Scenario: Receive writing feedback
- **WHEN** user completes writing a character
- **THEN** system provides feedback on stroke order accuracy and character correctness

#### Scenario: Track writing progress
- **WHEN** user practices writing characters
- **THEN** system tracks which characters have been practiced and stores progress


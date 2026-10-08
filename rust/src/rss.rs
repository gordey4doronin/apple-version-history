use std::sync::LazyLock;

use regex::{Captures, Regex};

/// An item of Apple RSS feed,
/// with only the fields the puller uses.
#[derive(Debug, PartialEq)]
pub struct RssItem {
    pub title: String,
    pub pub_date: String,
}

/// Parses items from Apple RSS feed.
///
/// Only handles what the feed uses:
/// items of plain elements with text, CDATA and entities.
/// Attributes, nested elements and comments are not supported.
pub fn parse_rss_items(xml: &str) -> Vec<RssItem> {
    xml.split("<item>")
        // Everything before the first <item> is the channel header.
        .skip(1)
        .map(|rest| {
            let item = &rest[..rest.find("</item>").expect("<item> without </item>")];

            RssItem {
                title: element_text(item, "title").expect("<item> without <title>"),
                pub_date: element_text(item, "pubDate").expect("<item> without <pubDate>"),
            }
        })
        .collect()
}

/// Finds the first `<name>` element of an item,
/// and returns its decoded text.
fn element_text(item: &str, name: &str) -> Option<String> {
    let open = format!("<{name}>");
    let close = format!("</{name}>");

    let start = item.find(&open)? + open.len();
    let end = start + item[start..].find(&close)?;

    Some(decode_xml_text(&item[start..end]))
}

/// Compiled once, on first use.
static XML_TEXT_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?is)<!\[CDATA\[(.*?)\]\]>|&(#x[\da-f]+|#\d+|\w+);").unwrap());

/// Decodes CDATA sections and XML entities of an element's text.
fn decode_xml_text(text: &str) -> String {
    XML_TEXT_REGEX
        .replace_all(text, |caps: &Captures| match caps.get(1) {
            Some(cdata) => cdata.as_str().to_string(),
            // Unknown entities are kept as they are.
            None => decode_entity(&caps[2]).map_or_else(|| caps[0].to_string(), String::from),
        })
        .into_owned()
}

/// Decodes an entity name like `amp`, `#169` or `#xA9` into its character.
fn decode_entity(entity: &str) -> Option<char> {
    match entity {
        "amp" => Some('&'),
        "lt" => Some('<'),
        "gt" => Some('>'),
        "quot" => Some('"'),
        "apos" => Some('\''),
        _ => {
            let number = entity.strip_prefix('#')?;
            let code = match number.strip_prefix(['x', 'X']) {
                Some(hex) => u32::from_str_radix(hex, 16).ok()?,
                None => number.parse().ok()?,
            };
            char::from_u32(code)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decodes_cdata_and_entities() {
        let text = "<![CDATA[<p>a & b</p>]]> &amp; &#169; &#xA9; &nbsp;";

        assert_eq!(decode_xml_text(text), "<p>a & b</p> & © © &nbsp;");
    }

    #[test]
    fn parses_items_of_apple_rss() {
        let items = parse_rss_items(include_str!("../../test/fixtures/apple.rss"));

        assert_eq!(items.len(), 35);
        assert_eq!(
            items[0],
            RssItem {
                title: "iPadOS 26.3 beta2 (23D5103d)".to_string(),
                pub_date: "Mon, 12 Jan 2026 09:00:00 PST".to_string(),
            }
        );
        assert_eq!(items[34].title, "iPadOS 13.1.2 (17A860/17A861)");
    }
}

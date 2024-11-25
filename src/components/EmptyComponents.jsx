import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import MetaAILogo from '../assets/logo_t.png';
import CustomText from './CustomText';


const exampleData = [
    "🌞 Good morning! How can I start my day productively?",
    "🤔 Can you help me understand quantum physics?",
    "🚀 What's the latest news in space exploration?",
    "📚 Recommend me a good book to read this weekend!",
    "🍕 What's the best pizza place nearby?",
    "💡 Any tips on improving my coding skills?",
    "🎶 Suggest some good music to relax.",
    "🌍 What's the current state of climate change?",
    "📈 How can I invest smartly in stocks?",
    "🎉 What's the most exciting tech innovation of 2024?",
    "💼 How can I boost my career growth?",
    "📅 What are some productivity tips for managing my schedule?",
    "🧠 How can I improve my memory and focus?",
    "📱 What are the best apps for learning new skills?",
    "🌱 How can I live a more eco-friendly lifestyle?",
    "📊 What are some common investment strategies?",
    "🚴‍♂️ What are the health benefits of cycling?",
    "🍽️ What are some easy recipes for a busy workday?",
    "💻 What's the best way to learn programming online?",
    "🎨 Can you give me some creative hobby ideas?",
    "🧳 What's the best destination for a weekend getaway?",
    "🤖 How is AI transforming different industries?",
    "🎓 What are the best online courses for self-improvement?",
    "⚽ Who's leading the soccer league this season?",
    "🌌 What's the latest discovery in astronomy?",
    "🎬 Any good movies to watch this month?",
    "🎮 What are some popular video games right now?",
    "🍷 Can you recommend a good wine for a celebration?",
    "🗞️ What's the top headline in the news today?",
    "💪 How can I stay motivated to exercise regularly?",
    "🌸 What are the best tips for growing indoor plants?",
    "🎤 What’s trending in the world of music?",
    "📸 How can I take better photos with my smartphone?",
    "🍲 What are the benefits of a plant-based diet?",
    "📱 How can I limit my screen time effectively?",
    "💡 How do I turn a creative idea into a startup?",
    "🎂 What's a unique way to celebrate a birthday?",
    "🎧 Recommend me some podcasts for personal development.",
    "📍 What are the top tourist attractions in Paris?",
    "🎯 How can I set and achieve my personal goals?",
    "🌧️ What's the weather like today in my area?",
    "📚 How can I develop a daily reading habit?",
    "🧘 How can I practice mindfulness and reduce stress?",
    "📈 What are the latest trends in the tech industry?",
    "🚢 What's the best cruise line for a family vacation?",
    "📷 How do I edit photos like a pro?",
    "💬 What are some great conversation starters?",
    "🏋️ What’s the best way to stay fit with minimal equipment?",
    "🍩 Where can I find the best donuts in town?",
    "📅 What are some important upcoming events globally?",
    "📡 What advancements are being made in satellite technology?",
];

const groupDataIntoRows = (data) => {
    const rows = [];
    for (let i = 0; i < data.length; i += 3) {
        rows.push(data.slice(i, i + 3));
    }
    return rows;
};

const EmptyComponents = ({ isTyping }) => {

    const rotation = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true
            }),
        ).start();
    }, [rotation]);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    const ItemScroll = ({ item }) => {
        return (
            <TouchableOpacity style={styles.touchableItem}>
                <Text style={styles.touchableText}>{item}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Animated.Image source={MetaAILogo} style={[styles.image,
                { transform: [{ rotate }] },
                ]} />
            </View>

            <CustomText size={RFValue(22)}>Ask Meta AI Anything</CustomText>

            {!isTyping && (
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollContainer}
                >
                    {groupDataIntoRows(exampleData).map((rowItems, rowIndex) => (
                        <View style={styles.rowContainer} key={rowIndex}>
                            {rowItems.map((item, index) => (
                                <ItemScroll item={item} key={index} />
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgContainer: {
        width: RFValue(100),
        height: RFValue(100),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    scrollContainer: {
        marginTop: 20,
        maxHeight: RFValue(120),
       
    },
    rowContainer: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    scrollContent: {
        alignItems: 'center'
    },
    touchableItem: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        padding: 10,
        marginVertical: 5
    },
    touchableText: {
        fontSize: RFValue(12),
        color: 'white'
    }
})

export default EmptyComponents